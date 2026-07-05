'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils/formatters'

interface ProductItem {
  id: string
  name: string
  brand: string
  type: string
  price: number
  stock: number
  alert_threshold: number
  is_active: boolean
  images?: string[]
}

function StockBadge({ stock, threshold }: { stock: number; threshold: number }) {
  if (stock === 0) return <span className="inline-flex rounded-full bg-red-500/20 px-2.5 py-1 text-xs font-medium text-red-400">Sin stock</span>
  if (stock <= threshold) return <span className="inline-flex rounded-full bg-yellow-500/15 px-2.5 py-1 text-xs font-medium text-yellow-300">⚠ {stock}</span>
  return <span className="inline-flex rounded-full bg-zinc-700/60 px-2.5 py-1 text-xs font-medium text-zinc-300">{stock}</span>
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const loadProducts = async () => {
    const supabase = createClient()
    if (!supabase) return

    const { data } = await supabase
      .from('products')
      .select('id, name, brand, type, price, stock, alert_threshold, is_active, images')
      .order('created_at', { ascending: false })
    setProducts((data ?? []) as ProductItem[])
    setLoading(false)
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)
    if (!confirmed) return

    setDeleting(id)
    const supabase = createClient()
    if (!supabase) { setDeleting(null); return }

    await supabase.from('products').delete().eq('id', id)
    setDeleting(null)
    await loadProducts()
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Productos</h1>
          <p className="mt-2 text-sm text-zinc-400">Gestiona el catálogo desde aquí.</p>
        </div>
        <button
          onClick={() => router.push('/admin/productos/nuevo')}
          className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo producto
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-zinc-400">
            <svg className="mr-3 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Cargando productos...
          </div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center text-sm text-zinc-500">
            No hay productos. <button onClick={() => router.push('/admin/productos/nuevo')} className="text-emerald-400 hover:underline">Crear el primero</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-zinc-300">
              <thead className="border-b border-zinc-800 bg-zinc-800/60 text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3">Producto</th>
                  <th className="px-5 py-3">Marca / Tipo</th>
                  <th className="px-5 py-3">Precio</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-zinc-800/60 transition hover:bg-zinc-800/30">
                    {/* Product name + thumbnail */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-10 w-10 flex-shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                        <p className="font-medium text-white">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-zinc-300">{product.brand}</p>
                      <p className="text-xs text-zinc-500">{product.type}</p>
                    </td>
                    <td className="px-5 py-4 font-medium text-white">{formatCurrency(product.price)}</td>
                    <td className="px-5 py-4">
                      <StockBadge stock={product.stock} threshold={product.alert_threshold} />
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${product.is_active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-zinc-700/60 text-zinc-400'}`}>
                        {product.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/admin/productos/${product.id}/editar`)}
                          className="rounded-xl border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => void handleDelete(product.id, product.name)}
                          disabled={deleting === product.id}
                          className="rounded-xl border border-red-500/40 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10 disabled:opacity-40"
                        >
                          {deleting === product.id ? '...' : 'Eliminar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
