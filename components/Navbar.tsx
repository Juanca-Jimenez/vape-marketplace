'use client'

import Link from 'next/link'
import CartButton from '@/components/CartButton'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold text-white hover:text-emerald-400">
            VapeMarket
          </Link>
          <div className="hidden items-center gap-5 text-sm text-zinc-400 md:flex">
            <Link href="/tienda" className="transition hover:text-white">
              Catálogo
            </Link>
            <Link href="/carrito" className="transition hover:text-white">
              Carrito
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CartButton />
        </div>
      </div>
    </nav>
  )
}
