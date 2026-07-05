'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/store/cart'
import { formatCurrency } from '@/lib/utils/formatters'
import { Toast } from '@/components/ui/Toast'

export interface Product {
  id: string
  name: string
  brand: string
  flavor: string
  type: string
  price: number
  stock: number
  images?: string[] | null
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const imageUrl = product.images?.[0] ?? '/placeholder-product.png'

  useEffect(() => {
    if (!justAdded) return

    const timer = window.setTimeout(() => setJustAdded(false), 1200)
    return () => window.clearTimeout(timer)
  }, [justAdded])

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
    setJustAdded(true)
    setShowToast(false)
    window.setTimeout(() => setShowToast(true), 20)
  }

  return (
    <div className="relative">
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-500/40">
        <div className="relative h-48 overflow-hidden bg-zinc-800">
          <img src={imageUrl} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
          {product.stock === 0 ? (
            <span className="absolute left-3 top-3 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Agotado
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{product.brand}</p>
            <h3 className="text-lg font-semibold text-white">{product.name}</h3>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-zinc-400">
            <span className="rounded-full border border-zinc-800 px-2 py-1">{product.flavor}</span>
            <span className="rounded-full border border-zinc-800 px-2 py-1">{product.type}</span>
          </div>

          <div className="mt-auto flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold text-emerald-400">
                {formatCurrency(product.price)}
              </p>
              <span className="text-sm text-zinc-400">{product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}</span>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/tienda/${product.id}`}
                className="flex-1 rounded-2xl border border-zinc-700 px-4 py-3 text-center text-sm font-semibold text-zinc-200 transition hover:border-emerald-400 hover:text-white"
              >
                Ver detalle
              </Link>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {justAdded ? 'Agregado ✓' : 'Agregar al carrito'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toast message="Producto agregado al carrito" show={showToast} />
    </div>
  )
}
