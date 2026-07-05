'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CartButton from '@/components/CartButton'

const navItems = [
  { href: '/tienda', label: 'Catálogo' },
  { href: '/carrito', label: 'Carrito' },
  { href: '/admin/login', label: 'Admin' },
]

export default function Navbar() {
  const pathname = usePathname()

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
          </div>
          <CartButton />
        </div>
      </div>
    </nav>
  )
}
