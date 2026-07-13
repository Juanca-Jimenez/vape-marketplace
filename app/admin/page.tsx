import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils/formatters'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending_payment: { label: 'Pago pendiente', color: 'bg-yellow-500/15 text-yellow-300' },
  verifying:       { label: 'Verificando',    color: 'bg-blue-500/15 text-blue-300' },
  paid:            { label: 'Pagado',          color: 'bg-emerald-500/15 text-emerald-300' },
  shipped:         { label: 'Enviado',         color: 'bg-purple-500/15 text-purple-300' },
  delivered:       { label: 'Entregado',       color: 'bg-green-500/15 text-green-300' },
}

export default async function AdminPage() {
  const supabase = await createClient()

  if (!supabase) {
    return <div className="text-zinc-400">No fue posible conectar con Supabase.</div>
  }

  // Metrics
  const [
    { count: totalProductos },
    { count: stockBajo },
    { count: totalOrdenes },
    { data: ingresoData },
    { data: ultimasOrdenes },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('products').select('*', { count: 'exact', head: true }).lte('stock', 5),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total').in('status', ['paid', 'shipped', 'delivered']),
    supabase
      .from('orders')
      .select('id, status, total, created_at, customer_name, customer_email')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const ingresoTotal = (ingresoData ?? []).reduce((sum, o) => sum + (Number(o.total) || 0), 0)

  const cards = [
    {
      label: 'Productos activos',
      value: totalProductos ?? 0,
      color: 'text-white',
      bg: 'border-zinc-700 bg-zinc-800/60',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      label: 'Stock bajo (≤5)',
      value: stockBajo ?? 0,
      color: (stockBajo ?? 0) > 0 ? 'text-red-400' : 'text-white',
      bg: (stockBajo ?? 0) > 0 ? 'border-red-500/30 bg-red-500/10' : 'border-zinc-700 bg-zinc-800/60',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
    },
    {
      label: 'Órdenes totales',
      value: totalOrdenes ?? 0,
      color: 'text-white',
      bg: 'border-zinc-700 bg-zinc-800/60',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: 'Ingresos (pagados)',
      value: formatCurrency(ingresoTotal),
      color: 'text-emerald-400',
      bg: 'border-emerald-500/20 bg-emerald-500/10',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-zinc-400">Resumen general del marketplace.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-3xl border p-6 ${card.bg}`}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">{card.label}</p>
              {card.icon}
            </div>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Last orders */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-white">Últimas órdenes</h2>
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
          {!ultimasOrdenes || ultimasOrdenes.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500">Aún no hay órdenes registradas.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-zinc-300">
                <thead className="border-b border-zinc-800 bg-zinc-800/60 text-xs uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Cliente</th>
                    <th className="px-5 py-3">Fecha</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimasOrdenes.map((order) => {
                    const status = STATUS_LABELS[order.status] ?? { label: order.status, color: 'bg-zinc-700 text-zinc-300' }
                    return (
                      <tr key={order.id} className="border-t border-zinc-800/60 transition hover:bg-zinc-800/30">
                        <td className="px-5 py-4 font-mono text-xs text-zinc-500">#{order.id.slice(0, 8).toUpperCase()}</td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-white">{order.customer_name || '—'}</p>
                          <p className="text-xs text-zinc-500">{order.customer_email || ''}</p>
                        </td>
                        <td className="px-5 py-4 text-zinc-400">
                          {new Date(order.created_at).toLocaleDateString('es-CO', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-5 py-4 font-semibold text-white">{formatCurrency(Number(order.total))}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
