'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import CartButton from '@/components/CartButton'

export default function Navbar() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return

    // Check session on mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAdmin(!!user)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  const navItems = [
    { href: '/tienda', label: 'Catálogo' },
    { href: '/carrito', label: 'Carrito' },
  ]

  const adminHref = isAdmin ? '/admin' : '/admin/login'
  const isAdminActive = pathname.startsWith('/admin')

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold text-white transition hover:text-emerald-400">
          VapeMarket
        </Link>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-2 sm:gap-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-300">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-2 transition ${isActive ? 'bg-emerald-500/15 text-emerald-300' : 'hover:bg-white/10 hover:text-white'}`}
                >
                  {item.label}
                </Link>
              )
            })}

            {/* Admin link — smart based on session */}
            <Link
              href={adminHref}
              className={`relative flex items-center gap-1.5 rounded-full px-3 py-2 transition ${
                isAdminActive
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              {/* Shield icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              {isAdmin ? 'Panel Admin' : 'Admin'}
              {/* Green pulse when logged in as admin */}
              {isAdmin && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
              )}
            </Link>
          </div>
          <CartButton />
        </div>
      </div>
    </nav>
  )
}
