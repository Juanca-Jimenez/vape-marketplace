'use client'

import { useState } from 'react'
import { useCart } from '@/lib/store/cart'
import { Toast } from '@/components/ui/Toast'
import { formatCurrency } from '@/lib/utils/formatters'

interface Product {
  id: string
  name: string
  brand: string
  flavor: string
  type: string
  price: number
  stock: number
  description?: string | null
  images?: string[] | null
}

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart()
  const [showToast, setShowToast] = useState(false)
  const imageUrl = product.images?.[0] ?? '/placeholder-product.png'

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      flavor: product.flavor,
      price: product.price,
      image: imageUrl,
      quantity: 1,
    })
    setShowToast(false)
    window.setTimeout(() => setShowToast(true), 20)
  }

  return (
    <>
      <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-lg shadow-black/20 lg:flex-row lg:items-start">
        <div className="w-full lg:w-[45%]">
          <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-800">
            <img src={imageUrl} alt={product.name} className="h-[420px] w-full object-cover" />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">{product.brand}</p>
            <h1 className="text-3xl font-semibold text-white">{product.name}</h1>
            <div className="flex flex-wrap gap-2 text-sm text-zinc-400">
              <span className="rounded-full border border-zinc-800 px-2 py-1">{product.flavor}</span>
              <span className="rounded-full border border-zinc-800 px-2 py-1">{product.type}</span>
            </div>
          </div>

          <p className="text-zinc-300">{product.description || 'Sin descripción disponible.'}</p>

          <div className="flex flex-wrap items-center gap-4">
            <p className="text-3xl font-semibold text-emerald-400">
              {formatCurrency(product.price)}
            </p>
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${product.stock === 0 ? 'bg-red-500/15 text-red-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
              {product.stock === 0 ? 'Agotado' : `${product.stock} disponibles`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </main>
      <Toast message="Producto agregado al carrito" show={showToast} />
    </>
  )
}
