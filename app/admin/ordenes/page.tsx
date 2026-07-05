'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface OrderItem {
  id: string
  status: string
  total: number
  created_at: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    const supabase = createClient()
    if (!supabase) return

    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders((data ?? []) as OrderItem[])
    setLoading(false)
  }

  useEffect(() => {
    void loadOrders()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    if (!supabase) return

    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, status } : order)))
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white">Órdenes</h1>
      <p className="mt-2 text-sm text-zinc-400">Administra el estado de los pedidos.</p>

      <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
        {loading ? (
          <div className="p-6 text-zinc-400">Cargando...</div>
        ) : (
          <table className="min-w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-800 text-zinc-200">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-zinc-800">
                  <td className="px-4 py-3">{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">{new Date(order.created_at).toLocaleString('es-CO')}</td>
                  <td className="px-4 py-3">${order.total}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(event) => void updateStatus(order.id, event.target.value)}
                      className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
                    >
                      <option value="pending_payment">pending_payment</option>
                      <option value="verifying">verifying</option>
                      <option value="paid">paid</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
