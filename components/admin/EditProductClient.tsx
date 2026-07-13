'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProductForm, type ProductFormData } from '@/components/admin/ProductForm'

interface ProductItem {
  id: string
  name: string
  brand: string
  flavor: string
  type: string
  price: number
  cost: number
  stock: number
  alert_threshold: number
  description: string
  images?: string[] | null
  is_active: boolean
}

interface EditProductClientProps {
  product: ProductItem
}

export function EditProductClient({ product }: EditProductClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (data: ProductFormData, imageFile?: File | null) => {
    setLoading(true)
    setError('')

    const supabase = createClient()
    if (!supabase) {
      setError('Error al guardar. Intenta de nuevo.')
      setLoading(false)
      return
    }

    let publicUrl = product.images?.[0] ?? ''

    if (imageFile) {
      const filePath = `products/${Date.now()}-${imageFile.name}`
      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, imageFile)
      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)
        publicUrl = data.publicUrl
      }
    }

    const { error: updateError } = await supabase.from('products').update({
      name: data.name,
      brand: data.brand,
      flavor: data.flavor,
      type: data.type,
      price: Number(data.price),
      cost: Number(data.cost),
      stock: Number(data.stock),
      alert_threshold: Number(data.alert_threshold),
      description: data.description,
      images: publicUrl ? [publicUrl] : [],
      is_active: data.is_active,
    }).eq('id', product.id)

    if (updateError) {
      setError('Error al guardar. Intenta de nuevo.')
      setLoading(false)
      return
    }

    router.push('/admin/productos')
  }

  const toggleActive = async (nextValue: boolean) => {
    const supabase = createClient()
    if (!supabase) return

    await supabase.from('products').update({ is_active: nextValue }).eq('id', product.id)
    router.refresh()
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white">Editar producto</h1>
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      <div className="mt-6">
        <ProductForm initialData={{
          name: product.name,
          brand: product.brand,
          flavor: product.flavor,
          type: product.type,
          price: String(product.price),
          cost: String(product.cost),
          stock: String(product.stock),
          alert_threshold: String(product.alert_threshold),
          description: product.description ?? '',
          is_active: product.is_active,
        }} loading={loading} onSubmit={handleSubmit} />
      </div>

      <div className="mt-4 flex gap-3">
        {product.is_active ? (
          <button onClick={() => void toggleActive(false)} className="rounded-2xl border border-zinc-700 px-4 py-3 text-sm text-zinc-200">
            Desactivar producto
          </button>
        ) : (
          <button onClick={() => void toggleActive(true)} className="rounded-2xl border border-zinc-700 px-4 py-3 text-sm text-zinc-200">
            Activar producto
          </button>
        )}
      </div>
    </div>
  )
}
