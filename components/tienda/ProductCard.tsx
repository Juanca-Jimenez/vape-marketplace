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
  description?: string | null
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder-product.png']
  const imageUrl = images[0]

  useEffect(() => {
    if (!justAdded) return

    const timer = window.setTimeout(() => setJustAdded(false), 1200)
    return () => window.clearTimeout(timer)
  }, [justAdded])

  // Cerrar con Escape y bloquear scroll de fondo mientras el modal está abierto
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const marketingBadge = product.stock <= 5
    ? {
      label: 'MÁS VENDIDO',
      classes: 'bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] text-white shadow-md shadow-[rgba(147,51,234,0.15)]',
    }
    : {
      label: '15% OFF',
      classes: 'border border-[#ff2c2c] bg-red-600/59 text-white shadow-sm',
    }

  const handleAddToCart = (event?: React.MouseEvent) => {
    event?.stopPropagation()

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

  const tags = [product.brand, product.type, product.flavor].filter(Boolean)

  return (
    <div className="group relative">
      {/* Glow de gradiente detrás de la tarjeta, aparece en hover */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-60" />

      <button
        type="button"
        onClick={() => {
          setActiveImage(0)
          setIsOpen(true)
        }}
        className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white text-left shadow-md shadow-[rgba(37,99,235,0.05)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-[rgba(147,51,234,0.10)]"
      >
        {/* Franja superior de marca */}
        <span className="absolute inset-x-0 top-0 z-10 h-[2px] bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626]" />

        <div className="relative overflow-hidden bg-[#F8FAFC]">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <span
            className={`absolute left-2.5 top-2.5 z-10 rounded-full px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] ${marketingBadge.classes}`}
          >
            {marketingBadge.label}
          </span>

          {product.stock === 0 ? (
            <span className="absolute right-2.5 top-2.5 rounded-full bg-[#0F172A]/80 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
              Agotado
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-2.5 p-3.5">
          <div className="space-y-0.5">
            <p className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-[0.65rem] font-bold uppercase tracking-[0.22em] text-transparent">
              {product.brand}
            </p>
            <h3 className="line-clamp-1 text-sm font-semibold text-[#0F172A]">{product.name}</h3>
          </div>

          <div className="flex flex-wrap gap-1.5 text-[0.7rem]">
            <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 text-[#475569]">
              {product.flavor}
            </span>
            <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 text-[#475569]">
              {product.type}
            </span>
          </div>

          <div className="mt-auto flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-lg font-bold text-[#0F172A]">{formatCurrency(product.price)}</p>
              <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.1em] text-[#475569]">
                {product.stock > 0 ? `${product.stock} disp.` : 'Sin stock'}
              </span>
            </div>

            <span
              onClick={handleAddToCart}
              role="button"
              tabIndex={product.stock === 0 ? -1 : 0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleAddToCart()
                }
              }}
              aria-disabled={product.stock === 0}
              className={`group/btn relative block overflow-hidden rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-center text-xs font-semibold text-[#0F172A] transition-all duration-300 hover:border-transparent hover:shadow-md hover:shadow-[rgba(147,51,234,0.12)] ${product.stock === 0 ? 'pointer-events-none cursor-not-allowed opacity-50' : ''
                }`}
            >
              <span className="absolute inset-0 -z-10 bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-[length:200%_100%] bg-[position:0%_0%] opacity-0 transition-all duration-300 group-hover/btn:bg-[position:100%_0%] group-hover/btn:opacity-100" />
              <span className="transition-colors duration-300 group-hover/btn:text-white">
                {justAdded ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span>✓</span>
                    ¡Añadido!
                  </span>
                ) : (
                  'Agregar al carrito'
                )}
              </span>
            </span>
          </div>
        </div>
      </button>

      {/* Modal expandido con toda la info del producto */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[#E2E8F0] bg-white shadow-2xl"
          >
            <span className="absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626]" />

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar"
              className="absolute right-4 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0F172A] shadow-md ring-1 ring-[#E2E8F0] transition hover:bg-[#F8FAFC]"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              {/* Galería */}
              <div className="flex flex-col gap-3 bg-[#F8FAFC] p-6">
                <div className="aspect-square w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2">
                    {images.map((image, index) => (
                      <button
                        key={image + index}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        aria-label={`Ver imagen ${index + 1}`}
                        className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border transition ${activeImage === index
                          ? 'border-transparent shadow-[0_0_0_2px_rgba(147,51,234,0.5)]'
                          : 'border-[#E2E8F0] hover:border-[#9333EA]/40'
                          }`}
                      >
                        <img src={image} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-5 p-6 pt-10 sm:p-8 sm:pt-10">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-xs font-medium text-[#475569]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-[#0F172A]">{product.name}</h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-2xl font-bold text-transparent">
                    {formatCurrency(product.price)}
                  </span>

                  {product.stock === 0 ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8FAFC] px-3 py-1 text-xs font-semibold text-[#DC2626]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" />
                      Agotado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8FAFC] px-3 py-1 text-xs font-semibold text-[#16A34A]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                      {product.stock <= 5 ? `Últimas ${product.stock} unidades` : `${product.stock} disponibles`}
                    </span>
                  )}
                </div>

                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[#0F172A]">
                    Descripción
                  </h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#475569]">
                    {product.description?.trim() || 'Este producto no tiene una descripción disponible por el momento.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="group/btn relative mt-auto overflow-hidden rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-[length:200%_100%] bg-[position:0%_0%] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[rgba(147,51,234,0.08)] transition-all duration-300 hover:scale-[1.02] hover:bg-[position:100%_0%] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                >
                  {product.stock === 0
                    ? 'Sin stock disponible'
                    : justAdded
                      ? '✓ ¡Añadido al carrito!'
                      : 'Agregar al carrito'}
                </button>

                <p className="text-xs text-[#64748B]">
                  🔞 Venta exclusiva para mayores de 18 años. Este producto contiene nicotina, una
                  sustancia química adictiva.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast message="Producto agregado al carrito" show={showToast} />
    </div>
  )
}
