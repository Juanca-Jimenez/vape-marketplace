'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'

export async function getAdminOrders() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('orders')
      .select('id, user_id, status, total, address, created_at, payment_method, source')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    
    // Opcional: logear acceso a ordenes
    // logger.info({ domain: 'orders', action: 'fetch_all', message: 'Admin fetched all orders' })
    
    return data
  } catch (error) {
    logger.error({ domain: 'db', action: 'fetch_orders', message: 'Failed to fetch admin orders', error })
    return []
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)

    if (error) throw new Error(error.message)
    
    logger.info({ domain: 'orders', action: 'update_status', message: `Order ${id} status updated to ${status}` })
    return { success: true }
  } catch (error: any) {
    logger.error({ domain: 'orders', action: 'update_status_error', message: `Failed to update order ${id}`, error })
    // No devolvemos el error técnico al frontend (RNF-14, Req 5)
    return { success: false, error: 'No se pudo actualizar el estado del pedido. Inténtelo más tarde.' }
  }
}
