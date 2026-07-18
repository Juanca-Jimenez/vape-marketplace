import { ProductDetailClient } from '@/components/tienda/ProductDetailClient'
import { createClient } from '@/lib/supabase/server'

interface Product {
  id: string
  name: string
  brand: string
  flavor: string
  type: string
  price: number
  stock: number
  description?: string | null
  images?: string[] | null
}

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  if (!supabase) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
        <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-10 text-center">
          <h1 className="text-3xl font-semibold">Ocurrió un error. Intenta más tarde.</h1>
        </div>
      </main>
    )
  }

  const { data: product, error } = await supabase.from('products').select('*').eq('id', id).eq('is_active', true).single()

  if (error) {
    const isMissingProduct = error.code === 'PGRST116' || error.message?.toLowerCase().includes('no rows')

    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
        <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-10 text-center">
          <h1 className="text-3xl font-semibold">
            {isMissingProduct ? 'Este producto no está disponible.' : 'Ocurrió un error. Intenta más tarde.'}
          </h1>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
        <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-10 text-center">
          <h1 className="text-3xl font-semibold">Este producto no está disponible.</h1>
        </div>
      </main>
    )
  }

  return <ProductDetailClient product={product as Product} />
}
