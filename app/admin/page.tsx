import { formatCurrency } from '@/lib/utils/formatters'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending_payment: { label: 'Pago pendiente', color: 'bg-yellow-500/15 text-yellow-700 border border-yellow-500/20' },
  verifying: { label: 'Verificando', color: 'bg-blue-500/15 text-blue-700 border border-blue-500/20' },
  paid: { label: 'Pagado', color: 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/20' },
  shipped: { label: 'Enviado', color: 'bg-purple-500/15 text-purple-700 border border-purple-500/20' },
  delivered: { label: 'Entregado', color: 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/20' },
}

interface Order {
  id: string
  user_id?: string
  status: string
  total: number
  address?: string
  created_at: string
  payment_method?: string
  source?: string
}

async function fetchWithServiceKey(path: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return null

  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'count=exact',
    },
    cache: 'no-store',
  })

  if (!res.ok) return null
  return res
}

export default async function AdminPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    return <div className="text-red-600 p-8">Error: Variables de entorno de Supabase no configuradas.</div>
  }

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  }

  const [productosRes, stockBajoRes, ordenesRes, ingresoRes, todasOrdenesRes] = await Promise.all([
    fetch(`${url}/rest/v1/products?is_active=eq.true&select=id`, { headers, cache: 'no-store' }),
    fetch(`${url}/rest/v1/products?stock=lte.5&select=id`, { headers, cache: 'no-store' }),
    fetch(`${url}/rest/v1/orders?select=id`, { headers, cache: 'no-store' }),
    fetch(`${url}/rest/v1/orders?status=in.(paid,shipped,delivered)&select=total`, { headers, cache: 'no-store' }),
    fetch(`${url}/rest/v1/orders?select=id,user_id,status,total,address,created_at,payment_method,source&order=created_at.desc`, { headers, cache: 'no-store' }),
  ])

  const productosData: any[] = productosRes.ok ? await productosRes.json() : []
  const stockBajoData: any[] = stockBajoRes.ok ? await stockBajoRes.json() : []
  const ordenesData: any[] = ordenesRes.ok ? await ordenesRes.json() : []
  const ingresoData: any[] = ingresoRes.ok ? await ingresoRes.json() : []
  const todasOrdenes: Order[] = todasOrdenesRes.ok ? await todasOrdenesRes.json() : []

  const totalProductos = productosData.length
  const stockBajo = stockBajoData.length
  const totalOrdenes = ordenesData.length
  const ingresoTotal = ingresoData.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0)

  const cards = [
    {
      label: 'Productos activos',
      value: totalProductos,
      color: 'bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-transparent',
      bg: 'border-[#E2E8F0] bg-white shadow-xl shadow-[rgba(37,99,235,0.06)]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      label: 'Stock bajo (≤5)',
      value: stockBajo,
      color: stockBajo > 0 ? 'text-[#DC2626]' : 'text-[#0F172A]',
      bg: stockBajo > 0 ? 'border-[#DC2626]/30 bg-[#DC2626]/5 shadow-xl shadow-[rgba(220,38,38,0.06)]' : 'border-[#E2E8F0] bg-white shadow-xl shadow-[rgba(37,99,235,0.06)]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
    },
    {
      label: 'Órdenes totales',
      value: totalOrdenes,
      color: 'text-[#0F172A]',
      bg: 'border-[#E2E8F0] bg-white shadow-xl shadow-[rgba(37,99,235,0.06)]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: 'Ingresos (pagados)',
      value: formatCurrency(ingresoTotal),
      color: 'text-emerald-600',
      bg: 'border-emerald-500/20 bg-emerald-500/5 shadow-xl shadow-[rgba(16,185,129,0.06)]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#0F172A]">Dashboard</h1>
          <p className="mt-2 text-sm text-[#475569]">Resumen general del marketplace y listado de todas las órdenes.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-[2rem] border p-6 ${card.bg}`}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#64748B]">{card.label}</p>
              {card.icon}
            </div>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* All orders */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
          Todas las órdenes
          <span className="ml-2 rounded-full bg-[#E2E8F0] px-2.5 py-1 text-sm font-bold text-[#475569]">{todasOrdenes.length}</span>
        </h2>
        <div className="overflow-hidden rounded-[2rem] border border-[#E2E8F0] bg-white shadow-xl shadow-[rgba(37,99,235,0.06)]">
          {todasOrdenes.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#64748B]">Aún no hay órdenes registradas.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-[#0F172A]">
                <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold uppercase tracking-wider text-[#475569]">
                  <tr>
                    <th className="px-5 py-4">ID</th>
                    <th className="px-5 py-4">Dirección / Método de pago</th>
                    <th className="px-5 py-4">Fecha</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {todasOrdenes.map((order) => {
                    const status = STATUS_LABELS[order.status] ?? { label: order.status, color: 'bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]' }
                    return (
                      <tr key={order.id} className="border-t border-[#E2E8F0] transition hover:bg-[#F8FAFC]/50">
                        <td className="px-5 py-4 font-mono text-xs text-[#64748B]">#{order.id.slice(0, 8).toUpperCase()}</td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#0F172A]">{order.address || '—'}</p>
                          <p className="text-xs text-[#64748B]">{order.payment_method ? `Pago: ${order.payment_method}` : ''}</p>
                        </td>
                        <td className="px-5 py-4 text-[#64748B]">
                          {new Date(order.created_at).toLocaleDateString('es-CO', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-5 py-4 font-bold text-[#0F172A]">{formatCurrency(Number(order.total))}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
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

