import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase?.auth.getUser() ?? { data: { user: null } }
  const cookieStore = await cookies()
  const roleCookie = cookieStore.getAll().find((cookie) => cookie.name === 'vape_role')?.value
  const hasLocalAdmin = roleCookie === 'admin'

  if (!user && !hasLocalAdmin) {
    return <>{children}</>
  }

  const userEmail = user?.email ?? 'admin@local'

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <AdminSidebar userEmail={userEmail} />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
