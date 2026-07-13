'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils/formatters'

interface OrderItem {
  id: string
  status: string
  total: number
  created_at: string
  customer_name?: string
  customer_email?: string
}

const STATUS_OPTIONS = [
  { value: 'pending_payment', label: 'Pago pendiente' },
  { value: 'verifying',       label: 'Verificando' },
  { value: 'paid',            label: 'Pagado' },
  { value: 'shipped',         label: 'Enviado' },
  { value: 'delivered',       label: 'Entregado' },
]

const STATUS_COLORS: Record<string, string> = {
  pending_payment: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  verifying:       'bg-blue-500/15 text-blue-300 border-blue-500/30',
  paid:            'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  shipped:         'bg-purple-500/15 text-purple-300 border-purple-500/30',
  delivered:       'bg-green-500/15 text-green-300 border-green-500/30',
}

function StatusBadge({ status }: { status: string }) {
  const found = STATUS_OPTIONS.find((s) => s.value === status)
  const label = found?.label ?? status
  const colors = STATUS_COLORS[status] ?? 'bg-zinc-700/60 text-zinc-300 border-zinc-600'
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${colors}`}>
      {label}
    </span>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const loadOrders = async () => {
    const supabase = createClient()
    if (!supabase) return

    const { data } = await supabase
      .from('orders')
      .select('id, status, total, created_at, customer_name, customer_email')
      .order('created_at', { ascending: false })
    setOrders((data ?? []) as OrderItem[])
    setLoading(false)
  }

  useEffect(() => {
    void loadOrders()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    const supabase = createClient()
    if (!supabase) { setUpdating(null); return }

    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order))
    )
    setUpdating(null)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">Órdenes</h1>
        <p className="mt-2 text-sm text-zinc-400">Administra y actualiza el estado de los pedidos.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-zinc-400">
            <svg className="mr-3 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Cargando órdenes...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-sm text-zinc-500">Aún no hay órdenes registradas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-zinc-300">
              <thead className="border-b border-zinc-800 bg-zinc-800/60 text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Estado actual</th>
                  <th className="px-5 py-3">Cambiar estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-zinc-800/60 transition hover:bg-zinc-800/30">
                    <td className="px-5 py-4 font-mono text-xs text-zinc-500">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
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
                    <td className="px-5 py-4 font-semibold text-white">
                      {formatCurrency(Number(order.total))}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(event) => void updateStatus(order.id, event.target.value)}
                          disabled={updating === order.id}
                          className="w-full appearance-none rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 pr-8 text-xs text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {updating === order.id ? (
                          <svg className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
