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
  if (stock === 0) return <span className="inline-flex rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-600">Sin stock</span>
  if (stock <= threshold) return <span className="inline-flex rounded-full bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 text-xs font-semibold text-yellow-600">⚠ {stock}</span>
  return <span className="inline-flex rounded-full bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 text-xs font-semibold text-[#475569]">{stock}</span>
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
          <h1 className="text-3xl font-semibold text-[#0F172A]">Productos</h1>
          <p className="mt-2 text-sm text-[#475569]">Gestiona el catálogo desde aquí.</p>
        </div>
        <button
          onClick={() => router.push('/admin/productos/nuevo')}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-[length:200%_100%] bg-[position:0%_0%] px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-[position:100%_0%] active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo producto
        </button>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-[#E2E8F0] bg-white shadow-xl shadow-[rgba(37,99,235,0.06)]">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-[#94A3B8]">
            <svg className="mr-3 h-5 w-5 animate-spin text-[#2563EB]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Cargando productos...
          </div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#475569]">
            No hay productos. <button onClick={() => router.push('/admin/productos/nuevo')} className="text-[#2563EB] font-semibold hover:underline">Crear el primero</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-[#0F172A]">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold uppercase tracking-wider text-[#475569]">
                <tr>
                  <th className="px-5 py-4">Producto</th>
                  <th className="px-5 py-4">Marca / Tipo</th>
                  <th className="px-5 py-4">Precio</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-[#E2E8F0] transition hover:bg-[#F8FAFC]/50">
                    {/* Product name + thumbnail */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-10 w-10 flex-shrink-0 rounded-xl object-cover border border-[#E2E8F0]"
                          />
                        ) : (
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                        <p className="font-semibold text-[#0F172A]">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#0F172A]">{product.brand}</p>
                      <p className="text-xs text-[#64748B]">{product.type}</p>
                    </td>
                    <td className="px-5 py-4 font-bold text-[#0F172A]">{formatCurrency(product.price)}</td>
                    <td className="px-5 py-4">
                      <StockBadge stock={product.stock} threshold={product.alert_threshold} />
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold border ${product.is_active ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}>
                        {product.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/productos/${product.id}/editar`)}
                          className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] shadow-sm transition hover:border-[#9333EA]/40 hover:bg-[#F8FAFC]"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => void handleDelete(product.id, product.name)}
                          disabled={deleting === product.id}
                          className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-500/10 disabled:opacity-40"
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
