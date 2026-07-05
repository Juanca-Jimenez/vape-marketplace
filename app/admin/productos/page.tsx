'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface ProductItem {
  id: string
  name: string
  brand: string
  type: string
  price: number
  stock: number
  alert_threshold: number
  is_active: boolean
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadProducts = async () => {
    const supabase = createClient()
    if (!supabase) return

    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts((data ?? []) as ProductItem[])
    setLoading(false)
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('¿Eliminar este producto?')
    if (!confirmed) return

    const supabase = createClient()
    if (!supabase) return

    await supabase.from('products').delete().eq('id', id)
    await loadProducts()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Productos</h1>
          <p className="mt-2 text-sm text-zinc-400">Gestiona el catálogo desde aquí.</p>
        </div>
        <button onClick={() => router.push('/admin/productos/nuevo')} className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-black">
          Nuevo producto
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
        {loading ? (
          <div className="p-6 text-zinc-400">Cargando...</div>
        ) : (
          <table className="min-w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-800 text-zinc-200">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Marca</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-zinc-800">
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{product.brand}</td>
                  <td className="px-4 py-3">{product.type}</td>
                  <td className="px-4 py-3">${product.price}</td>
                  <td className={`px-4 py-3 ${product.stock <= product.alert_threshold ? 'text-red-400' : ''}`}>{product.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs ${product.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700 text-zinc-300'}`}>
                      {product.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => router.push(`/admin/productos/${product.id}/editar`)} className="rounded-xl border border-zinc-700 px-3 py-2 text-xs text-zinc-200">
                        Editar
                      </button>
                      <button onClick={() => void handleDelete(product.id)} className="rounded-xl border border-red-500/40 px-3 py-2 text-xs text-red-300">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
