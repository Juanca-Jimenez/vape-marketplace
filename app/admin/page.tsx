import { createClient } from '@/lib/supabase/server'

export default async function AdminPage() {
  const supabase = await createClient()

  if (!supabase) {
    return <div className="text-zinc-400">No fue posible conectar con Supabase.</div>
  }

  const { count: totalProductos } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: stockBajo } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .lte('stock', 5)

  const { count: totalOrdenes } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  const cards = [
    { label: 'Productos activos', value: totalProductos ?? 0 },
    { label: 'Stock bajo', value: stockBajo ?? 0 },
    { label: 'Órdenes recibidas', value: totalOrdenes ?? 0 },
  ]

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-4xl font-semibold text-white">{card.value}</p>
            <p className="mt-2 text-sm text-zinc-400">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
