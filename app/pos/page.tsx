import { POSDashboard } from '@/components/pos/POSDashboard'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/components/tienda/ProductCard'

export default async function POSPage() {
  const supabase = await createClient()

  if (!supabase) {
    return (
      <main className="min-h-screen bg-white px-6 py-16 text-[#0F172A]">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-[#E2E8F0] bg-white p-10 text-center shadow-xl shadow-[rgba(37,99,235,0.08)]">
          <h1 className="text-3xl font-semibold text-[#0F172A]">Configura Supabase</h1>
          <p className="mt-3 text-[#475569]">No se pudo conectar a la base de datos.</p>
        </div>
      </main>
    )
  }

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  const productos = (products ?? []) as Product[]

  return <POSDashboard initialProducts={productos} />
}
