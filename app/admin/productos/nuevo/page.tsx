'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProductForm, type ProductFormData } from '@/components/admin/ProductForm'

export default function NewProductPage() {
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

    let publicUrl = ''

    if (imageFile) {
      const filePath = `products/${Date.now()}-${imageFile.name}`
      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, imageFile)
      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)
        publicUrl = data.publicUrl
      }
    }

    const { error: insertError } = await supabase.from('products').insert({
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
    })

    if (insertError) {
      setError('Error al guardar. Intenta de nuevo.')
      setLoading(false)
      return
    }

    router.push('/admin/productos')
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white">Nuevo producto</h1>
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      <div className="mt-6">
        <ProductForm loading={loading} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
