'use client'

import { FormEvent, useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/store/cart'
import { formatCurrency } from '@/lib/utils/formatters'
import { createBrowserClient } from '@supabase/ssr'
import { logClientEvent } from '@/lib/logger/actions'

const paymentMethods = [
  {
    value: 'nequi',
    title: 'Transferencia Nequi',
    description: 'Transfiere al celular 300 123 4567 y envía el comprobante por WhatsApp.',
    icon: '📱',
  },
  {
    value: 'lulo',
    title: 'Transferencia Lulo / Lave / Daviplata',
    description: 'Transfiere al celular 300 123 4567 y envía el comprobante por WhatsApp.',
    icon: '🟣',
  },
  {
    value: 'cash',
    title: 'Efectivo / Pago al recibir',
    description: 'Pagarás tu pedido en efectivo. Coordina la entrega por WhatsApp con un asesor.',
    icon: '💵',
  },
]

type PaymentMethodValue = 'nequi' | 'lulo' | 'cash'

export function CheckoutSection() {
  const { cart, total, clearCart } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [instructions, setInstructions] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodValue>('nequi')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ name: false, phone: false, address: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOrderSaved, setIsOrderSaved] = useState(false)
  const [isSavingOrder, setIsSavingOrder] = useState(false)

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '573137175806'

  const cartSummary = useMemo(() => {
    return cart.map((item) => `${item.name} x${item.quantity} ($${item.price.toLocaleString('es-CO')})`).join('\n')
  }, [cart])

  const buildMessage = () => {
    if (paymentMethod === 'cash') {
      return `🛸 *¡NUEVO PEDIDO EN VAPEMARKET (EFECTIVO)!* 🛸\n\n👤 *Cliente:* ${name}\n📞 *Teléfono:* ${phone}\n📍 *Dirección:* ${address}${instructions ? `\n📌 *Indicaciones:* ${instructions}` : ''}\n\n🛒 *Productos:*\n${cartSummary}\n\n💰 *TOTAL A PAGAR EN EFECTIVO:* $${total.toLocaleString('es-CO')}\n\n⚡ _Quedo atento a la confirmación del despacho._`
    }

    const methodLabel = paymentMethod === 'nequi' ? 'Nequi' : 'Lulo / Lave / Daviplata'
    return `🛸 *¡NUEVO PEDIDO EN VAPEMARKET (TRANSFERENCIA)!* 🛸\n\n👤 *Cliente:* ${name}\n📞 *Teléfono:* ${phone}\n📍 *Dirección:* ${address}${instructions ? `\n📌 *Indicaciones:* ${instructions}` : ''}\n\n🛒 *Productos:*\n${cartSummary}\n\n💰 *TOTAL:* $${total.toLocaleString('es-CO')}\n📱 *Método:* ${methodLabel}\n\n📸 *Adjunto en este chat el comprobante de transferencia por valor de $${total.toLocaleString('es-CO')}. *\n\n⚡ _Quedo atento a la verificación del pago._\n\n*Realiza tu pedido*`
  }

  const router = useRouter()

  useEffect(() => {
    if (cart.length === 0) {
      router.replace('/tienda')
    }
  }, [cart.length, router])

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = event.target.value.replace(/\D/g, '')
    setPhone(digitsOnly)
  }

  const handleSaveOrder = async () => {
    const errors = {
      name: !name.trim(),
      phone: !phone.trim(),
      address: !address.trim(),
    }
    setFieldErrors(errors)

    if (errors.name || errors.phone || errors.address) {
      setErrorMessage('Completa Nombre, Teléfono y Dirección para continuar.')
      return
    }

    if (cart.length === 0) {
      setErrorMessage('El carrito está vacío. Agrega productos antes de continuar.')
      return
    }

    setErrorMessage('')
    setIsSavingOrder(true)

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const items = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }))

    const mappedPayment = paymentMethod === 'cash' ? 'efectivo' : 'transferencia'

    const { error: rpcError } = await supabase.rpc('process_pos_sale', {
      p_items: items,
      p_payment_method: mappedPayment,
    })

    if (rpcError) {
      void logClientEvent('error', 'orders', 'create_order_failed', 'Checkout RPC failed', { items, paymentMethod: mappedPayment }, name, rpcError.message)
      setErrorMessage(rpcError.message || 'Error al guardar el pedido. Intenta de nuevo.')
      setIsSavingOrder(false)
      return
    }

    void logClientEvent('info', 'orders', 'create_order_success', 'Order created successfully via Checkout', { itemsCount: items.length, paymentMethod: mappedPayment, total }, name)
    setIsOrderSaved(true)
    setIsSavingOrder(false)
  }

  const submitCheckout = () => {
    if (!isOrderSaved) {
      setErrorMessage('Debes guardar el pedido primero.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    const message = encodeURIComponent(buildMessage())
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    setIsSubmitting(false)
    clearCart()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitCheckout()
  }

  const inputClass = (hasError: boolean) =>
    `w-full rounded-2xl border bg-white px-4 py-3.5 text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:shadow-[0_0_0_3px_rgba(147,51,234,0.12)] ${hasError ? 'border-[#DC2626] focus:border-[#DC2626]' : 'border-[#E2E8F0] focus:border-transparent'
    }`

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-[#0F172A]">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-8 shadow-xl shadow-[rgba(37,99,235,0.08)]">
          <p className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-sm font-semibold uppercase tracking-[0.35em] text-transparent">
            Finaliza tu compra
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-[#0F172A]">Realiza tu pedido</h1>
          <p className="mt-3 max-w-2xl text-[#475569]">
            Completa tus datos, elige tu forma de pago y envía tu pedido directo por WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.85fr]">
          {/* Columna principal */}
          <section className="space-y-6">
            {/* Datos de envío */}
            <div className="rounded-[1.75rem] border border-[#E2E8F0] bg-white p-6 shadow-lg shadow-[rgba(37,99,235,0.05)]">
              <h2 className="text-xl font-semibold text-[#0F172A]">Datos de envío</h2>
              <p className="mt-2 text-sm text-[#475569]">
                Nombre completo, teléfono y dirección son obligatorios para procesar tu pedido.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#0F172A]">
                    Nombre completo <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ej. Juan Pérez"
                    required
                    className={inputClass(fieldErrors.name)}
                  />
                  {fieldErrors.name && (
                    <p className="text-xs text-[#DC2626]">Este campo es obligatorio.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#0F172A]">
                    Teléfono de contacto <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Ej. 3001234567"
                    required
                    maxLength={10}
                    className={inputClass(fieldErrors.phone)}
                  />
                  {fieldErrors.phone && (
                    <p className="text-xs text-[#DC2626]">Este campo es obligatorio.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#0F172A]">
                    Dirección de envío completa <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Calle, número, barrio, ciudad"
                    required
                    className={inputClass(fieldErrors.address)}
                  />
                  {fieldErrors.address && (
                    <p className="text-xs text-[#DC2626]">Este campo es obligatorio.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#0F172A]">
                    Indicaciones adicionales <span className="text-[#64748B] font-normal">(opcional)</span>
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(event) => setInstructions(event.target.value)}
                    rows={3}
                    placeholder="Ej. Dejar en la portería o cerca de la moto..."
                    className={inputClass(false)}
                  />
                </div>
              </form>
            </div>

            {/* Métodos de pago */}
            <div className="rounded-[1.75rem] border border-[#E2E8F0] bg-white p-6 shadow-lg shadow-[rgba(37,99,235,0.05)]">
              <h2 className="text-xl font-semibold text-[#0F172A]">Métodos de pago</h2>
              <p className="mt-2 text-sm text-[#475569]">Selecciona la opción que prefieras para completar tu pedido.</p>
              <div className="mt-6 grid gap-3">
                {paymentMethods.map((method) => {
                  const isSelected = paymentMethod === method.value
                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentMethod(method.value as PaymentMethodValue)}
                      className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition ${isSelected
                          ? 'border-transparent bg-[#F8FAFC] shadow-[0_0_0_2px_rgba(147,51,234,0.35)]'
                          : 'border-[#E2E8F0] bg-white hover:border-[#9333EA]/30 hover:bg-[#F8FAFC]'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#F8FAFC] text-xl">
                          {method.icon}
                        </span>
                        <div>
                          <p className="text-base font-semibold text-[#0F172A]">{method.title}</p>
                          <p className="mt-0.5 text-sm text-[#475569]">{method.description}</p>
                        </div>
                      </div>
                      <div
                        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-xs transition ${isSelected
                            ? 'border-transparent bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] text-white'
                            : 'border-[#E2E8F0] text-transparent'
                          }`}
                      >
                        ✓
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Info de pago */}
            <div className="rounded-[1.75rem] border border-[#E2E8F0] bg-[#F8FAFC] p-6">
              <p className="text-sm font-semibold text-[#0F172A]">Información de pago</p>
              <p className="mt-2 text-sm leading-6 text-[#475569]">
                {paymentMethod === 'cash' ? (
                  'Pagarás tu pedido en efectivo. Tu orden se enviará a WhatsApp para coordinar la entrega con un asesor.'
                ) : (
                  <>
                    Transfiere al celular:{' '}
                    <span className="font-semibold text-[#9333EA]">300 123 4567</span> y luego envía el
                    comprobante por WhatsApp para que procesemos tu pedido.
                  </>
                )}
              </p>
            </div>
          </section>

          {/* Resumen */}
          <aside className="h-fit space-y-6 lg:sticky lg:top-8">
            <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-6 shadow-xl shadow-[rgba(37,99,235,0.08)]">
              <p className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-sm font-semibold uppercase tracking-[0.3em] text-transparent">
                Resumen del pedido
              </p>
              <div className="mt-5 space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{item.name}</p>
                      <p className="text-sm text-[#64748B]">
                        x{item.quantity} · {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[#0F172A]">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-[#E2E8F0] pt-5">
                <span className="text-sm font-medium text-[#475569]">Total</span>
                <span className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-2xl font-bold text-transparent">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[#E2E8F0] bg-white p-6 shadow-lg shadow-[rgba(37,99,235,0.05)]">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#64748B]">Estado del pago</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-lg">
                    🛡️
                  </div>
                  <p className="text-sm text-[#475569]">Pago seguro con seguimiento directo por WhatsApp.</p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-lg">
                    ⚡
                  </div>
                  <p className="text-sm text-[#475569]">Recibe instrucciones claras para tu método elegido.</p>
                </div>
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-[#DC2626]/20 bg-[#DC2626]/5 p-4 text-sm text-[#DC2626]">
                {errorMessage}
              </div>
            ) : null}

            {isOrderSaved && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-700">
                ✅ Pedido guardado y stock actualizado. Ya puedes enviarlo por WhatsApp.
              </div>
            )}

            {!isOrderSaved ? (
              <button
                type="button"
                onClick={handleSaveOrder}
                disabled={isSavingOrder}
                className={`w-full rounded-2xl bg-[#0F172A] px-6 py-4 text-base font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  isSavingOrder ? 'opacity-70' : ''
                }`}
              >
                {isSavingOrder ? 'GUARDANDO PEDIDO...' : 'GUARDAR PEDIDO'}
              </button>
            ) : null}

            <button
              type="button"
              onClick={submitCheckout}
              disabled={isSubmitting || !isOrderSaved}
              className={`w-full rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-[length:200%_100%] bg-[position:0%_0%] px-6 py-4 text-base font-bold tracking-wide text-white shadow-lg shadow-[rgba(147,51,234,0.08)] transition-all duration-300 hover:scale-[1.02] hover:bg-[position:100%_0%] active:scale-[0.98] ${
                isSubmitting || !isOrderSaved ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Generando pedido...' : 'FINALIZAR PEDIDO EN WHATSAPP'}
            </button>
          </aside>
        </div>
      </div>
    </main>
  )
}