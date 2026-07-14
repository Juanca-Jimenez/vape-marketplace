'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CartButton from '@/components/CartButton'

const navItems = [
  { href: '/tienda', label: 'Catálogo' },
  { href: '/carrito', label: 'Carrito' },
]

export default function Navbar() {
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
          <Link
            href="/"
            className="text-xl font-semibold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-500 transition duration-300 hover:opacity-90"
          >
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

          <div className="hidden items-center gap-4 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative inline-flex items-center text-sm font-medium transition-colors ${
                  isActive(item.href) ? 'text-[#EF4444]' : 'text-slate-200 hover:text-[#00F5FF]'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                <span
                  className={`absolute left-0 bottom-[-2px] h-[2px] w-full origin-center scale-x-0 bg-[#EF4444] transition-transform duration-300 group-hover:scale-x-100 ${
                    isActive(item.href) ? 'scale-x-100' : ''
                  }`}
                />
              </Link>
            ))}
            <Link
              href="/login"
              className="inline-flex items-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-400/15 hover:text-white"
            >
              Iniciar sesión
            </Link>
          </div>

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
                <span
                  className={`block h-[2px] w-full origin-center scale-x-0 bg-[#EF4444] transition-transform duration-300 group-hover:scale-x-100 ${
                    isActive(item.href) ? 'scale-x-100' : ''
                  }`}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
