'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart, type CartProduct } from '@/lib/store/cart'
import { formatCurrency } from '@/lib/utils/formatters'

const paymentMethods = [
  {
    value: 'nequi',
    title: 'Transferencia Nequi',
    description: 'Transfiere al celular 300 123 4567 y envía el comprobante por WhatsApp.',
    accent: 'text-blue-300',
    pill: 'bg-blue-500/10 text-cyan-300 ring-blue-500/20',
  },
  {
    value: 'lulo',
    title: 'Transferencia Lulo / Lave / Daviplata',
    description: 'Transfiere al celular 300 123 4567 y envía el comprobante por WhatsApp.',
    accent: 'text-blue-300',
    pill: 'bg-blue-500/10 text-cyan-300 ring-blue-500/20',
  },
  {
    value: 'cash',
    title: 'Efectivo / Pago al recibir',
    description: 'Pagarás tu pedido en efectivo. Coordina la entrega por WhatsApp con un asesor.',
    accent: 'text-red-300',
    pill: 'bg-red-500/10 text-red-300 ring-red-500/20',
  },
]

type PaymentMethodValue = 'nequi' | 'lulo' | 'cash'

export function CheckoutSection() {
  const { cart, total } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [instructions, setInstructions] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodValue>('nequi')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '573137175806'

  const cartSummary = useMemo(() => {
    return cart.map((item) => `${item.name} x${item.quantity} ($${item.price.toLocaleString('es-CO')})`).join('\n')
  }, [cart])

  const buildMessage = () => {
    if (paymentMethod === 'cash') {
      return `🛸 *¡NUEVO PEDIDO EN VAPEMARKET (EFECTIVO)!* 🛸\n\n👤 *Cliente:* ${name}\n📞 *Teléfono:* ${phone}\n📍 *Dirección:* ${address}${instructions ? `\n📌 *Indicaciones:* ${instructions}` : ''}\n\n🛒 *Productos:*\n${cartSummary}\n\n💰 *TOTAL A PAGAR EN EFECTIVO:* $${total.toLocaleString('es-CO')}\n\n⚡ _Quedo atento a la confirmación del despacho._`
    }

    const methodLabel = paymentMethod === 'nequi' ? 'Nequi' : 'Lulo / Lave / Daviplata'
    return `🛸 *¡NUEVO PEDIDO EN VAPEMARKET (TRANSFERENCIA)!* 🛸\n\n👤 *Cliente:* ${name}\n📞 *Teléfono:* ${phone}\n📍 *Dirección:* ${address}${instructions ? `\n📌 *Indicaciones:* ${instructions}` : ''}\n\n🛒 *Productos:*\n${cartSummary}\n\n💰 *TOTAL:* $${total.toLocaleString('es-CO')}\n📱 *Método:* ${methodLabel}\n\n📸 *Adjunto en este chat el comprobante de transferencia por valor de $${total.toLocaleString('es-CO')}. *\n\n⚡ _Quedo atento a la verificación del pago._`
  }

  const router = useRouter()

  useEffect(() => {
    if (cart.length === 0) {
      router.replace('/tienda')
    }
  }, [cart.length, router])

  const submitCheckout = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setErrorMessage('Completa Nombre, Teléfono y Dirección para continuar.')
      return
    }

    if (cart.length === 0) {
      setErrorMessage('El carrito está vacío. Agrega productos antes de continuar.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    const message = encodeURIComponent(buildMessage())
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    setIsSubmitting(false)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitCheckout()
  }

  const selectedMethod = paymentMethods.find((method) => method.value === paymentMethod)

  return (
    <main className="min-h-screen bg-[#030712] px-6 py-16 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="rounded-[2rem] border border-blue-500/10 bg-[#07101f]/90 p-8 shadow-[0_0_80px_rgba(14,165,233,0.10)]">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Finaliza tu compra</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Checkout Cyberpunk</h1>
          <p className="mt-4 max-w-3xl text-slate-400">Completa tus datos, elige tu forma de pago y envía tu pedido directo por WhatsApp con estilo neon.</p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_0.85fr]">
          <section className="space-y-8 rounded-[2rem] border border-blue-500/10 bg-[#08101f]/90 p-8 shadow-[0_0_80px_rgba(239,68,68,0.08)]">
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-blue-500/20 bg-[#050c18]/80 p-6 shadow-[0_0_25px_rgba(59,130,246,0.10)]">
                <h2 className="text-xl font-semibold text-white">Datos de envío</h2>
                <p className="mt-2 text-sm text-slate-400">Nombre completo, teléfono y dirección son obligatorios para procesar tu pedido.</p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Nombre Completo</label>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="w-full rounded-3xl border border-blue-500/20 bg-[#020911] px-4 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Teléfono de Contacto</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="Ej. 3001234567"
                      className="w-full rounded-3xl border border-blue-500/20 bg-[#020911] px-4 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Dirección de Envío Completa</label>
                    <input
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder="Calle, número, barrio, ciudad"
                      className="w-full rounded-3xl border border-blue-500/20 bg-[#020911] px-4 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Indicaciones adicionales (opcional)</label>
                    <textarea
                      value={instructions}
                      onChange={(event) => setInstructions(event.target.value)}
                      rows={3}
                      placeholder="Ej. Dejar en la portería o cerca de la moto..."
                      className="w-full rounded-3xl border border-blue-500/20 bg-[#020911] px-4 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </form>
              </div>

              <div className="rounded-[1.75rem] border border-blue-500/20 bg-[#050c18]/80 p-6 shadow-[0_0_25px_rgba(59,130,246,0.10)]">
                <h2 className="text-xl font-semibold text-white">Métodos de pago</h2>
                <p className="mt-2 text-sm text-slate-400">Selecciona la opción que prefieras para completar tu pedido.</p>
                <div className="mt-6 grid gap-4">
                  {paymentMethods.map((method) => {
                    const isSelected = paymentMethod === method.value
                    return (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setPaymentMethod(method.value as PaymentMethodValue)}
                        className={`group flex w-full items-start justify-between gap-4 rounded-[1.5rem] border px-5 py-5 text-left transition ${isSelected ? 'border-red-500/40 bg-[#101623]' : 'border-blue-500/10 bg-[#020812]'} hover:border-cyan-400/40 hover:bg-[#08131f]`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${method.pill}`}>{method.value === 'cash' ? '💵' : method.value === 'nequi' ? '📱' : '🟣'}</span>
                            <div>
                              <p className={`text-lg font-semibold ${isSelected ? 'text-white' : 'text-slate-100'}`}>{method.title}</p>
                              <p className="text-sm text-slate-400">{method.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full border transition ${isSelected ? 'border-cyan-400 bg-cyan-400 text-[#030712]' : 'border-slate-700 text-slate-500'}`}>
                          {isSelected ? '✓' : ''}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-blue-500/20 bg-[#050c18]/80 p-6 shadow-[0_0_25px_rgba(59,130,246,0.10)]">
                <div className="rounded-3xl border border-blue-500/20 bg-[#071822]/80 p-5 text-slate-300">
                  <p className="text-sm font-semibold text-white">Información de pago</p>
                  <p className="mt-3 text-sm leading-7">
                    {paymentMethod === 'cash' ? (
                      'Pagarás tu pedido en efectivo. Tu orden se enviará a WhatsApp para coordinar la entrega con un asesor.'
                    ) : (
                      <>Transfiere al celular: <span className="text-cyan-300">300 123 4567</span> y luego envía el comprobante por WhatsApp para que procesemos tu pedido.</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6 rounded-[2rem] border border-blue-500/10 bg-[#07101f]/90 p-8 shadow-[0_0_80px_rgba(14,165,233,0.10)]">
            <div className="rounded-[1.75rem] border border-blue-500/20 bg-[#050d19]/80 p-6 text-slate-300 shadow-[0_0_20px_rgba(59,130,246,0.08)]">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Resumen del pedido</p>
              <div className="mt-6 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-3xl border border-blue-500/10 bg-[#03121f]/80 p-4">
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-slate-400">x{item.quantity} · {formatCurrency(item.price)}</p>
                    </div>
                    <p className="text-sm font-semibold text-cyan-300">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-3xl border border-blue-500/10 bg-[#020a14]/80 p-5">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Total</span>
                  <span className="text-xl font-semibold text-white">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-blue-500/20 bg-[#050d19]/80 p-6 text-slate-300 shadow-[0_0_20px_rgba(239,68,68,0.08)]">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Estado del pago</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 rounded-3xl border border-blue-500/20 bg-[#03101f]/80 p-4">
                  <div className="h-10 w-10 rounded-2xl bg-cyan-400/10 text-cyan-300 flex items-center justify-center">🛡️</div>
                  <p className="text-sm text-slate-300">Pago seguro con seguimiento directo por WhatsApp.</p>
                </div>
                <div className="flex items-center gap-3 rounded-3xl border border-blue-500/20 bg-[#03101f]/80 p-4">
                  <div className="h-10 w-10 rounded-2xl bg-red-500/10 text-red-300 flex items-center justify-center">⚡</div>
                  <p className="text-sm text-slate-300">Recibe instrucciones claras para tu método elegido.</p>
                </div>
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{errorMessage}</div>
            ) : null}

            <button
              type="button"
              onClick={submitCheckout}
              disabled={isSubmitting}
              className={`w-full rounded-[2rem] bg-gradient-to-r from-blue-600 to-red-600 px-6 py-4 text-base font-bold tracking-wide text-white transition-all duration-300 shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:from-blue-500 hover:to-red-500 hover:shadow-[0_0_35px_rgba(239,68,68,0.45)] ${isSubmitting ? 'opacity-70' : 'animate-[pulse_1.8s_ease-in-out_infinite]'}`}
            >
              {isSubmitting ? 'Generando pedido...' : 'FINALIZAR PEDIDO EN WHATSAPP'}
            </button>
          </aside>
        </div>
      </div>
    </main>
  )
}
