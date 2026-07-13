'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
<<<<<<< HEAD
=======
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
>>>>>>> e751d2d191afd2ec25b0ebad43e92c44d8d80cf4
import CartButton from '@/components/CartButton'

const navItems = [
  { href: '/tienda', label: 'Catálogo' },
  { href: '/carrito', label: 'Carrito' },
]

export default function Navbar() {
<<<<<<< HEAD
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}`)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-transparent bg-[#030712]/80 backdrop-blur-md shadow-sm [border-image:linear-gradient(to_right,#3b82f6,#ef4444)_1]">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white text-[0.72rem] uppercase tracking-[0.28em] text-center font-semibold shadow-[0_0_18px_rgba(59,130,246,0.18)]">
        <p className="animate-pulse py-2">100% GARANTÍA DE ORIGINALIDAD</p>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-semibold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-500 transition duration-300 hover:opacity-90">
            VapeMarket
          </Link>

          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label="Abrir menú"
              onClick={() => setMenuOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#00F5FF]/30 bg-[#030712]/90 text-[#00F5FF] shadow-[0_0_12px_rgba(0,245,255,0.15)] transition hover:bg-[#08101e] focus:outline-none focus:ring-2 focus:ring-[#00F5FF]/50 focus:ring-offset-2 focus:ring-offset-[#030712]"
            >
              <span className="sr-only">Toggle navigation</span>
              <div className="flex h-5 w-5 flex-col justify-between">
                <span className="block h-[2px] w-full rounded-full bg-current" />
                <span className="block h-[2px] w-full rounded-full bg-current" />
                <span className="block h-[2px] w-full rounded-full bg-current" />
              </div>
            </button>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative inline-flex items-center text-sm font-medium transition-colors ${
                  isActive(item.href) ? 'text-[#EF4444]' : 'text-slate-200 hover:text-[#00F5FF]'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                <span className={`absolute left-0 bottom-[-2px] h-[2px] w-full origin-center scale-x-0 bg-[#EF4444] transition-transform duration-300 group-hover:scale-x-100 ${
                  isActive(item.href) ? 'scale-x-100' : ''
                }`} />
              </Link>
            ))}
          </div>

=======
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
>>>>>>> e751d2d191afd2ec25b0ebad43e92c44d8d80cf4
          <CartButton />
        </div>

        <div className={`overflow-hidden transition-all duration-300 md:hidden ${menuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-800/70 bg-[#030712]/95 p-4 shadow-[0_0_18px_rgba(0,245,255,0.08)]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`group inline-flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                  isActive(item.href) ? 'text-[#EF4444]' : 'text-slate-200 hover:text-[#00F5FF]'
                }`}
              >
                <span>{item.label}</span>
                <span className={`block h-[2px] w-full origin-center scale-x-0 bg-[#EF4444] transition-transform duration-300 group-hover:scale-x-100 ${
                  isActive(item.href) ? 'scale-x-100' : ''
                }`} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
