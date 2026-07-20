import { redirect } from 'next/navigation'
import { POSDashboard } from '@/components/pos/POSDashboard'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/components/tienda/ProductCard'

export default async function POSPage() {
  const supabase = await createClient()

  if (!supabase) {
    redirect('/login')
  }

  // Defensa en profundidad: verificar sesión y rol en el Server Component
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'customer'

  if (role !== 'admin' && role !== 'pos') {
    redirect('/login')
  }

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  const productos = (products ?? []) as Product[]

  return <POSDashboard initialProducts={productos} />
}

