'use client'

import Link from 'next/link'
import { useCart } from '@/components/CartProvider'

export default function CarritoPage() {
  const { cart, count, total, removeFromCart, updateQuantity, clearCart } = useCart()

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
        <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-10 text-center">
          <h1 className="text-3xl font-semibold">Tu carrito está vacío</h1>
          <p className="mt-4 text-zinc-400">Agrega productos al carrito desde el catálogo para comenzar.</p>
          <Link href="/tienda" className="mt-8 inline-flex rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400">
            Ir al catálogo
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Carrito</p>
            <h1 className="mt-3 text-3xl font-semibold">Tus artículos</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-400">Total de artículos: {count}</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">{total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/80">
          <div className="divide-y divide-zinc-800">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded-3xl object-cover" />
                  <div>
                    <p className="text-lg font-semibold text-white">{item.name}</p>
                    <p className="text-sm text-zinc-400">{item.brand} • {item.flavor}</p>
                    <p className="mt-2 text-sm text-zinc-400">{item.quantity} × {item.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8 rounded-full bg-zinc-800 text-white transition hover:bg-zinc-700"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8 rounded-full bg-zinc-800 text-white transition hover:bg-zinc-700"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
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
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </main>
  )
}
