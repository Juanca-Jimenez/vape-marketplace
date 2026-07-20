import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // Defensa en profundidad: verificar sesión Y rol en el Server Component.
  // El middleware ya bloquea en Edge Runtime; esto añade una segunda capa
  // de seguridad a nivel de SSR. /admin/login tiene su propio layout.tsx
  // que anula este, por lo que no se ejecuta para esa ruta.
  const { data: { user } } = await supabase?.auth.getUser() ?? { data: { user: null } }

  if (!user) {
    redirect('/login')
  }

  // Verificar que el rol sea admin en la tabla profiles
  const { data: profile } = await supabase!
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <AdminSidebar userEmail={user.email ?? 'admin'} />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}



