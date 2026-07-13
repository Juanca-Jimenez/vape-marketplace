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
  puffs?: string | null
  nicotine?: string | null
  compatibility?: string | null
  images?: string[] | null
}

interface ProductDetailClientProps {
  product: Product
}

const accordionItems = [
  {
    key: 'description',
    title: 'Descripción del producto',
    content: 'Descubre una experiencia de vapeo premium con acabados 100% futuristas y un rendimiento estable en cada calada.',
  },
  {
    key: 'puffs',
    title: 'Número de puffs',
    content: 'Hasta 600 puffs estimados con una extracción suave y consistente para sesiones largas.',
  },
  {
    key: 'nicotine',
    title: 'Nivel de nicotina',
    content: 'Nicotine balanceada para un golpe preciso en la garganta sin sacrificar la suavidad.',
  },
  {
    key: 'compatibility',
    title: 'Compatibilidad',
    content: 'Compatible con cargadores USB-C rápidos y cápsulas plug-and-play de última generación.',
  },
]

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart()
  const [showToast, setShowToast] = useState(false)
  const [expanded, setExpanded] = useState<string | null>('description')
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

  const toggleSection = (key: string) => {
    setExpanded((current) => (current === key ? null : key))
  }

  return (
    <>
      <main className="min-h-screen bg-[#030712] px-6 py-16 text-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          <div className="rounded-[2rem] border border-blue-500/10 bg-[#071021]/90 shadow-[0_0_80px_rgba(14,165,233,0.10)]">
            <div className="overflow-hidden rounded-[2rem] border border-blue-500/20 bg-[#050a16]">
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full min-h-[420px] w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>
          </div>

          <section className="space-y-8 rounded-[2rem] border border-blue-500/10 bg-[#08101f]/90 p-8 shadow-[0_0_80px_rgba(239,68,68,0.08)]">
            <div className="space-y-4">
              <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
                PRODUCTO/CYBER-PUNK
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">{product.brand}</p>
                <h1 className="mt-3 text-4xl font-semibold text-white">{product.name}</h1>
                <p className="mt-4 max-w-2xl text-slate-400">{product.description ?? 'Una experiencia digital de vapeo diseñada para destacar en cada sesión. Perfecto para usuarios que exigen estilo y potencia.'}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-2xl border border-blue-500/20 bg-[#061226] px-4 py-2 text-sm text-blue-200">{product.flavor}</span>
                <span className="rounded-2xl border border-blue-500/20 bg-[#061226] px-4 py-2 text-sm text-blue-200">{product.type}</span>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-blue-500/20 bg-[#050a14]/80 p-6 shadow-[0_0_30px_rgba(59,130,246,0.10)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-3xl font-semibold text-white">{formatCurrency(product.price)}</p>
                  <p className="mt-2 text-sm text-slate-400">Incluye envío exprés compatible con envíos neon.</p>
                </div>
                <span className={`rounded-full px-4 py-2 text-sm font-semibold ${product.stock === 0 ? 'bg-red-500/15 text-red-300' : 'bg-cyan-500/15 text-cyan-200'}`}>
                  {product.stock === 0 ? 'Sin stock' : `${product.stock} disponibles`}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`mt-8 w-full rounded-3xl bg-gradient-to-r from-blue-600 to-red-600 px-8 py-4 text-base font-bold tracking-wide text-white transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:from-blue-500 hover:to-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.45)] ${product.stock > 0 ? 'animate-[pulse_1.8s_ease-in-out_infinite]' : ''} ${product.stock === 0 ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                {product.stock === 0 ? 'No disponible' : 'Agregar al carrito'}
              </button>

              <div className="mt-6 grid gap-3 text-sm text-slate-300">
                <div className="flex gap-3 rounded-3xl border border-blue-500/20 bg-[#03101f]/80 p-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">🛡️</span>
                  <div>
                    <p className="font-semibold text-white">Garantía de Autenticidad</p>
                    <p className="text-slate-400">Código QR verificable en cada pedido.</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-3xl border border-blue-500/20 bg-[#03101f]/80 p-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">⚡</span>
                  <div>
                    <p className="font-semibold text-white">Envío Exprés Asegurado</p>
                    <p className="text-slate-400">Entrega rápida y rastreable.</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-3xl border border-blue-500/20 bg-[#03101f]/80 p-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">🔞</span>
                  <div>
                    <p className="font-semibold text-white">Venta exclusiva 18+</p>
                    <p className="text-slate-400">Verificación de edad obligatoria.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-[1.75rem] border border-blue-500/20 bg-[#050d19]/80 p-5 shadow-[0_0_40px_rgba(59,130,246,0.08)]">
              {accordionItems.map((item) => {
                const isOpen = expanded === item.key
                return (
                  <div key={item.key} className="overflow-hidden rounded-3xl border border-blue-500/10 bg-[#03101e]/80">
                    <button
                      type="button"
                      onClick={() => toggleSection(item.key)}
                      className="flex w-full items-center justify-between gap-3 p-5 text-left text-white transition-colors duration-200 hover:bg-blue-500/10"
                    >
                      <span className="font-semibold">{item.title}</span>
                      <span className={`text-lg transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                    <div className={`border-t border-blue-500/20 px-5 pb-5 transition-all duration-300 ${isOpen ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'} overflow-hidden`}>
                      <p className="text-sm leading-7 text-slate-300">
                        {item.key === 'description'
                          ? product.description ?? item.content
                          : item.key === 'puffs'
                          ? product.puffs ?? item.content
                          : item.key === 'nicotine'
                          ? product.nicotine ?? item.content
                          : product.compatibility ?? item.content}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </main>
      <Toast message="Producto agregado al carrito" show={showToast} />
    </>
  )
}
