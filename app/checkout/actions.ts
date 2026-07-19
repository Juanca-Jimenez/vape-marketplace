'use server'

import { createClient } from '@/lib/supabase/server'

interface DatosEnvio {
    nombre: string
    telefono: string
    ciudad: string
    direccion: string
}

interface CartItem {
    id: string
    name: string
    flavor?: string
    price: number
    quantity: number
}

// ── VALIDACIÓN (equivalente a Marshmallow en Flask)
function validarDatosEnvio(datos: DatosEnvio): string[] {
    const errores: string[] = []

    if (!datos.nombre || datos.nombre.trim().length < 2)
        errores.push('El nombre debe tener al menos 2 caracteres.')

    if (!datos.telefono || !/^\d{7,10}$/.test(datos.telefono.trim()))
        errores.push('El teléfono debe tener entre 7 y 10 dígitos.')

    if (!datos.ciudad || datos.ciudad.trim().length < 2)
        errores.push('La ciudad es obligatoria.')

    if (!datos.direccion || datos.direccion.trim().length < 5)
        errores.push('La dirección debe tener al menos 5 caracteres.')

    return errores
}

export async function crearOrden(
    datos: DatosEnvio,
    items: CartItem[],
    total: number
) {
    // ── VALIDACIÓN antes de tocar la base de datos
    const errores = validarDatosEnvio(datos)
    if (errores.length > 0) {
        console.warn('[VALIDACION-FALLIDA]', errores, new Date().toISOString())
        return { error: errores[0] }
    }

    if (!items || items.length === 0) {
        console.warn('[ORDEN-CARRITO-VACIO]', new Date().toISOString())
        return { error: 'El carrito está vacío.' }
    }

    const supabase = await createClient()
    if (!supabase) {
        console.error('[ERROR-SUPABASE] Cliente no disponible en checkout')
        return { error: 'No se pudo procesar tu pedido. Intenta de nuevo.' }
    }

    console.log('[ORDEN-INICIADA]', { total, items: items.length }, new Date().toISOString())

    try {
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                status: 'pending_payment',
                total,
                address: {
                    nombre: datos.nombre.trim(),
                    telefono: datos.telefono.trim(),
                    ciudad: datos.ciudad.trim(),
                    direccion: datos.direccion.trim(),
                },
                items: items.map((i) => ({
                    id: i.id,
                    name: i.name,
                    flavor: i.flavor ?? '',
                    quantity: i.quantity,
                    unit_price: i.price,
                })),
            })
            .select()
            .single()

        if (orderError) {
            console.error('[ERROR-ORDEN]', orderError.message, new Date().toISOString())
            return { error: 'No se pudo registrar tu pedido. Intenta de nuevo.' }
        }

        console.log('[ORDEN-CREADA]', order.id, `$${total} COP`, new Date().toISOString())
        return { success: true, orderId: order.id }

    } catch (e) {
        console.error('[ERROR-CRITICO-CHECKOUT]', e, new Date().toISOString())
        return { error: 'Ocurrió un error inesperado. Intenta más tarde.' }
    }
}