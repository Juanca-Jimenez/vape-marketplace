'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/lib/store/cart'
import { formatCurrency } from '@/lib/utils/formatters'
import { Toast } from '@/components/ui/Toast'

export default function CarritoPage() {
  const { cart, count, total, removeItem, updateQuantity, clearCart } = useCart()
  const [toast, setToast] = useState({ message: '', show: false })

  const triggerToast = (message: string) => {
    setToast({ message, show: false })
    window.setTimeout(() => setToast({ message, show: true }), 20)
  }

  const handleQuantityDecrease = (item: (typeof cart)[number]) => {
    if (item.quantity <= 1) {
      removeItem(item.id)
      triggerToast(`${item.name} eliminado del carrito`)
      return
    }
    updateQuantity(item.id, item.quantity - 1)
    triggerToast('Cantidad actualizada')
  }

  const handleQuantityIncrease = (item: (typeof cart)[number]) => {
    updateQuantity(item.id, item.quantity + 1)
    triggerToast('Cantidad actualizada')
  }

  const handleRemoveItem = (item: (typeof cart)[number]) => {
    removeItem(item.id)
    triggerToast(`${item.name} eliminado del carrito`)
  }

  const handleClearCart = () => {
    clearCart()
    triggerToast('Carrito vaciado')
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-[#0F172A]">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <p className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-sm font-semibold uppercase tracking-[0.35em] text-transparent">
            Carrito
          </p>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-3xl font-semibold text-[#0F172A]">Tus artículos</h1>
            <p className="text-sm text-[#475569]">
              {count === 0 ? 'Aún no has agregado nada' : `${count} ${count === 1 ? 'producto' : 'productos'} en tu carrito`}
            </p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-[#E2E8F0] bg-white p-16 text-center shadow-xl shadow-[rgba(37,99,235,0.08)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F8FAFC] text-3xl">
              🛒
            </div>
            <h2 className="text-2xl font-semibold text-[#0F172A]">Tu carrito está vacío</h2>
            <p className="max-w-sm text-sm text-[#475569]">
              Explora el catálogo y agrega tus productos favoritos para armar tu pedido.
            </p>
            <Link
              href="/tienda"
              className="mt-2 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-[length:200%_100%] bg-[position:0%_0%] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(147,51,234,0.08)] transition-all duration-300 hover:scale-[1.03] hover:bg-[position:100%_0%] active:scale-[0.98]"
            >
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Lista de productos */}
            <section className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-[1.75rem] border border-[#E2E8F0] bg-white p-5 shadow-lg shadow-[rgba(37,99,235,0.05)] transition-shadow hover:shadow-xl hover:shadow-[rgba(37,99,235,0.08)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 flex-shrink-0 rounded-2xl border border-[#E2E8F0] object-cover"
                    />
                    <div>
                      <p className="text-base font-semibold text-[#0F172A]">{item.name}</p>
                      <p className="mt-1 text-sm text-[#475569]">
                        {item.brand} · {item.flavor}
                      </p>
                      <p className="mt-1 text-sm text-[#64748B]">
                        {formatCurrency(item.price)} c/u
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-3">
                    <div className="flex items-center gap-1 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] p-1">
                      <button
                        type="button"
                        onClick={() => handleQuantityDecrease(item)}
                        aria-label={`Reducir cantidad de ${item.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#0F172A] transition hover:bg-white hover:shadow-sm"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-[#0F172A]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityIncrease(item)}
                        aria-label={`Aumentar cantidad de ${item.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#0F172A] transition hover:bg-white hover:shadow-sm"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-[#0F172A]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item)}
                        className="text-sm font-medium text-[#DC2626]/80 underline-offset-2 transition hover:text-[#DC2626] hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleClearCart}
                className="text-sm font-medium text-[#64748B] transition hover:text-[#DC2626]"
              >
                Vaciar carrito
              </button>
            </section>

            {/* Resumen del pedido */}
            <aside className="h-fit lg:sticky lg:top-8">
              <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-6 shadow-xl shadow-[rgba(37,99,235,0.08)]">
                <h2 className="text-lg font-semibold text-[#0F172A]">Resumen del pedido</h2>

                <div className="mt-5 space-y-3 border-b border-[#E2E8F0] pb-5 text-sm">
                  <div className="flex justify-between text-[#475569]">
                    <span>Subtotal ({count} {count === 1 ? 'producto' : 'productos'})</span>
                    <span className="font-medium text-[#0F172A]">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-[#475569]">
                    <span>Envío</span>
                    <span className="text-[#64748B]">Se calcula al pagar</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-base font-semibold text-[#0F172A]">Total</span>
                  <span className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-2xl font-bold text-transparent">
                    {formatCurrency(total)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-[length:200%_100%] bg-[position:0%_0%] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(147,51,234,0.08)] transition-all duration-300 hover:scale-[1.02] hover:bg-[position:100%_0%] active:scale-[0.98]"
                >
                  Finalizar compra
                </Link>

                <Link
                  href="/tienda"
                  className="mt-3 flex w-full items-center justify-center rounded-2xl border border-[#E2E8F0] px-6 py-3 text-sm font-medium text-[#0F172A] transition hover:border-transparent hover:bg-[#F8FAFC]"
                >
                  Seguir comprando
                </Link>

                <p className="mt-4 text-center text-xs text-[#64748B]">
                  🔒 Pago seguro · Verificación de edad requerida
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
      <Toast message={toast.message} show={toast.show} />
    </main>
  )
}