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
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Carrito</p>
            <h1 className="mt-3 text-3xl font-semibold">Tus artículos</h1>
            <p className="mt-3 max-w-xl text-sm text-zinc-400">Aquí puedes revisar los productos agregados, ajustar cantidades y ver el total acumulado del pedido.</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-right">
            <p className="text-sm text-zinc-400">Productos agregados</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-400">{count}</p>
            <p className="mt-3 text-sm text-zinc-400">Suma total</p>
            <p className="mt-1 text-2xl font-semibold text-white">{formatCurrency(total)}</p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-10 text-center">
            <h2 className="text-2xl font-semibold text-white">Tu carrito está vacío</h2>
            <p className="mt-3 text-zinc-400">Agrega productos desde el catálogo para comenzar tu pedido.</p>
            <Link href="/tienda" className="mt-6 inline-flex rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400">
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/80">
              <div className="divide-y divide-zinc-800">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-3xl object-cover" />
                      <div>
                        <p className="text-lg font-semibold text-white">{item.name}</p>
                        <p className="text-sm text-zinc-400">{item.brand} • {item.flavor}</p>
                        <p className="mt-2 text-sm text-zinc-400">{item.quantity} × {formatCurrency(item.price)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200">
                        <button
                          type="button"
                          onClick={() => handleQuantityDecrease(item)}
                          className="h-8 w-8 rounded-full bg-zinc-800 text-white transition hover:bg-zinc-700"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantityIncrease(item)}
                          className="h-8 w-8 rounded-full bg-zinc-800 text-white transition hover:bg-zinc-700"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-sm text-emerald-400">{formatCurrency(item.price * item.quantity)}</div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item)}
                        className="rounded-full border border-red-500 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-400">¿Listo para comprar? Revisa tu pedido y finaliza.</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/checkout"
                  className="inline-flex rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
                >
                  Finalizar compra
                </Link>
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="inline-flex rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  Vaciar carrito
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <Toast message={toast.message} show={toast.show} />
    </main>
  )
}
