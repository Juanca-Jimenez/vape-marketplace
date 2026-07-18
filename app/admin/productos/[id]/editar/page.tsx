import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditProductClient } from '@/components/admin/EditProductClient'

interface ProductEditPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: ProductEditPageProps) {
  const { id } = await params
  const supabase = await createClient()

  if (!supabase) {
    notFound()
  }

  const { data: product } = await supabase.from('products').select('*').eq('id', id).single()

  if (!product) {
    notFound()
  }

  return <EditProductClient product={product} />
}
