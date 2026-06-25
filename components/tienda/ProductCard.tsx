'use client'

import { useCart } from '@/components/CartProvider'

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
  const { addToCart } = useCart()
  const imageUrl = product.images?.[0] ?? '/placeholder-product.png'

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      flavor: product.flavor,
      price: product.price,
      image: imageUrl,
      quantity: 1,
    })
  }

  return (
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
              {product.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
            </p>
            <span className="text-sm text-zinc-400">{product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}</span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}
