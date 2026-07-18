'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils/formatters'
import { getAdminOrders, updateOrderStatus } from './actions'

interface OrderItem {
  id: string
  user_id?: string
  status: string
  total: number
  address?: string
  created_at: string
  payment_method?: string
  source?: string
}

const STATUS_OPTIONS = [
  { value: 'pending_payment', label: 'Pago pendiente' },
  { value: 'verifying', label: 'Verificando' },
  { value: 'paid', label: 'Pagado' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
]

const STATUS_COLORS: Record<string, string> = {
  pending_payment: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  verifying: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  paid: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  shipped: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
}

function StatusBadge({ status }: { status: string }) {
  const found = STATUS_OPTIONS.find((s) => s.value === status)
  const label = found?.label ?? status
  const colors = STATUS_COLORS[status] ?? 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]'
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${colors}`}>
      {label}
    </span>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const loadOrders = async () => {
    const data = await getAdminOrders()
    setOrders((data ?? []) as OrderItem[])
    setLoading(false)
  }

  useEffect(() => {
    void loadOrders()
  }, [])

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdating(id)
    const result = await updateOrderStatus(id, status)

    if (result.success) {
      setOrders((current) =>
        current.map((order) => (order.id === id ? { ...order, status } : order))
      )
    } else {
      alert('Error actualizando la orden: ' + result.error)
    }
    setUpdating(null)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0F172A]">Órdenes</h1>
        <p className="mt-2 text-sm text-[#475569]">Administra y actualiza el estado de los pedidos.</p>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-[#E2E8F0] bg-white shadow-xl shadow-[rgba(37,99,235,0.06)]">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-[#94A3B8]">
            <svg className="mr-3 h-5 w-5 animate-spin text-[#2563EB]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Cargando órdenes...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#475569]">Aún no hay órdenes registradas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-[#0F172A]">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold uppercase tracking-wider text-[#475569]">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Dirección / Método</th>
                  <th className="px-5 py-4">Fecha</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Estado actual</th>
                  <th className="px-5 py-4">Cambiar estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-[#E2E8F0] transition hover:bg-[#F8FAFC]/50">
                    <td className="px-5 py-4 font-mono text-xs text-[#64748B]">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
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
                    <td className="px-5 py-4 font-bold text-[#0F172A]">
                      {formatCurrency(Number(order.total))}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative w-40">
                        <select
                          value={order.status}
                          onChange={(event) => void handleUpdateStatus(order.id, event.target.value)}
                          disabled={updating === order.id}
                          className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 pr-8 text-xs font-medium text-[#0F172A] outline-none transition focus:border-transparent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {updating === order.id ? (
                          <svg className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 animate-spin text-[#2563EB]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
