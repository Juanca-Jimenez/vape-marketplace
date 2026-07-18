'use client'

import { CartProvider } from '@/components/CartProvider'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const isPublicPath =
      pathname === '/verificar-edad' ||
      pathname.startsWith('/admin/login') ||
      pathname === '/login'

    if (!isPublicPath) {
      const isVerified = sessionStorage.getItem('age_verified')
      if (!isVerified) {
        // Si no está verificado en la sesión actual (ej. se cerró la pestaña),
        // borramos la cookie y redirigimos para volver a preguntar.
        document.cookie = 'age_verified=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        router.replace('/verificar-edad')
      }
    }
  }, [pathname, router])

  return <CartProvider>{children}</CartProvider>
}
