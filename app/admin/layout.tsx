import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

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
      <aside className="w-56 border-r border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold text-white">Admin</h2>
        <nav className="mt-8 space-y-2">
          <Link href="/admin" className="block rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white">
            Dashboard
          </Link>
          <Link href="/admin/productos" className="block rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white">
            Productos
          </Link>
          <Link href="/admin/ordenes" className="block rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white">
            Órdenes
          </Link>
        </nav>

        <form action={signOut} className="mt-10">
          <button type="submit" className="w-full rounded-2xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800">
            Cerrar sesión
          </button>
        </form>
      </aside>

      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
