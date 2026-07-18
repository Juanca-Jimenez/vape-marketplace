'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function getAdminOrders() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('orders')
      .select('id, user_id, status, total, address, created_at, payment_method, source')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  } catch (error) {
    console.error('Error fetching admin orders:', error)
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
    return { success: true }
  } catch (error: any) {
    console.error('Error updating order status:', error)
    return { success: false, error: error.message }
  }
}
