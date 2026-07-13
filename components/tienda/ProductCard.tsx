'use client'

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

  const marketingBadge = product.stock <= 5
    ? { label: 'MÁS VENDIDO', classes: 'border border-red-500/30 bg-red-500/15 text-red-200' }
    : { label: '15% OFF', classes: 'border border-cyan-500/30 bg-cyan-500/15 text-cyan-200' }

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
      <div className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-blue-500/15 bg-[#050911] shadow-[0_0_30px_rgba(59,130,246,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(239,68,68,0.18)]">
        <div className="relative overflow-hidden rounded-t-[2rem] bg-[#071227]">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <span className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${marketingBadge.classes}`}>
            {marketingBadge.label}
          </span>

          {product.stock === 0 ? (
            <span className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white">
              Agotado
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{product.brand}</p>
            <h3 className="text-xl font-semibold text-white">{product.name}</h3>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-blue-500/20 bg-slate-900/80 px-3 py-1 text-blue-300">{product.flavor}</span>
            <span className="rounded-full border border-blue-500/20 bg-slate-900/80 px-3 py-1 text-blue-300">{product.type}</span>
          </div>

          <div className="mt-auto flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-2xl font-semibold text-white">{formatCurrency(product.price)}</p>
              <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="rounded-2xl border border-blue-500/30 bg-transparent px-4 py-3 text-sm font-semibold text-blue-300 transition-all duration-300 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {justAdded ? (
                <span className="inline-flex items-center gap-2 text-red-200">
                  <span className="text-lg">✓</span>
                  ¡AÑADIDO!
                </span>
              ) : (
                'Agregar al carrito'
              )}
            </button>
          </div>
        </div>
      </div>
      <Toast message="Producto agregado al carrito" show={showToast} />
    </div>
  )
}
