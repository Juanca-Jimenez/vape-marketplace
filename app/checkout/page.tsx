'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/store/cart'
import { formatCurrency } from '@/lib/utils/formatters'
import { createClient } from '@/lib/supabase/client'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, total, clearCart } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (cart.length === 0) {
      router.replace('/tienda')
    }
  }, [cart.length, router])

  const cartItems = useMemo(
    () =>
      cart.map((item) => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    [cart]
  )

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!name || !phone || !city || !address) {
      setErrorMessage('Completa todos los campos para continuar.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    const supabase = createClient()

    if (!supabase) {
      setErrorMessage('No se pudo completar el pedido. Intenta de nuevo.')
      setIsSubmitting(false)
      return
    }

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        status: 'pending_payment',
        total,
        address: {
          nombre: name,
          telefono: phone,
          ciudad: city,
          direccion: address,
        },
        items: cartItems,
      })
      .select('id')
      .single()

    if (error || !order) {
      setErrorMessage('No se pudo completar el pedido. Intenta de nuevo.')
      setIsSubmitting(false)
      return
    }

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '573001234567'
    const orderCode = String(order.id).slice(0, 8)
    const productsText = cartItems
      .map((item) => `${item.name} x${item.quantity} - $${item.price.toLocaleString('es-CO')}`)
      .join('\n')

    const message = encodeURIComponent(
      `Hola, quiero confirmar mi pedido ${orderCode}.\n\nProductos:\n${productsText}\n\nTotal: $${total.toLocaleString('es-CO')}\n\nDatos de envío:\nNombre: ${name}\nTeléfono: ${phone}\nCiudad: ${city}\nDirección: ${address}`
    )

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    clearCart()
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    router.replace('/checkout/confirmacion')
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
        <section className="flex-1 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-lg shadow-black/20">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Checkout</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Resumen del pedido</h1>

          <div className="mt-8 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-zinc-400">{item.quantity} × {formatCurrency(item.price)}</p>
                </div>
                <p className="text-sm font-semibold text-emerald-400">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="flex items-center justify-between text-sm text-zinc-400">
              <span>Total</span>
              <span className="text-xl font-semibold text-white">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </section>

        <section className="w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-lg shadow-black/20">
          <h2 className="text-xl font-semibold text-white">Datos de envío</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Nombre</label>
              <input required value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Teléfono</label>
              <input required value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Ciudad</label>
              <input required value={city} onChange={(event) => setCity(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Dirección</label>
              <input required value={address} onChange={(event) => setAddress(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
            </div>

            {errorMessage ? <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{errorMessage}</p> : null}

            <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
              {isSubmitting ? 'Procesando...' : 'Confirmar y enviar por WhatsApp'}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
