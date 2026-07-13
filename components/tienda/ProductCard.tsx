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
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#3B82F6]/20 bg-[#0B0F19] shadow-[0_0_15px_rgba(59,130,246,0.1)] transition duration-300 hover:-translate-y-1 hover:border-[#EF4444]/40 hover:shadow-[0_0_18px_rgba(239,68,68,0.2)]">
      <div className="relative h-48 overflow-hidden bg-[#08101e]">
        <img src={imageUrl} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        {product.stock === 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-[#EF4444]/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Agotado
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{product.brand}</p>
          <h3 className="text-lg font-semibold text-slate-100">{product.name}</h3>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-slate-400">
          <span className="rounded-full border border-slate-700 px-2 py-1">{product.flavor}</span>
          <span className="rounded-full border border-slate-700 px-2 py-1">{product.type}</span>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold text-[#00F5FF]">
              {product.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
            </p>
            <span className="text-sm text-slate-400">{product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}</span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="rounded-2xl bg-[#3B82F6] px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[#EF4444] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}
