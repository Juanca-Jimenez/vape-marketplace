'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = 'vape_role=; path=/; max-age=0;'
    document.cookie = 'age_verified=; path=/; max-age=0;'
    localStorage.removeItem('age_verified')
    router.push('/tienda')
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:border-red-400 hover:bg-red-500/20 hover:text-white"
    >
      Cerrar sesión
    </button>
  )
}
