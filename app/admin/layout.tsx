import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase?.auth.signOut()
  redirect('/admin/login')
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase?.auth.getUser() ?? { data: { user: null } }

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <AdminSidebar userEmail={user.email ?? ''} signOut={signOut} />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
