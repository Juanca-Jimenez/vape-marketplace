'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Category = 'Todos' | 'Desechables' | 'Líquidos' | 'Accesorios'

type Product = {
  id: string
  name: string
  price: number
  type: string
  brand?: string
  flavor?: string
  stock: number
}

const CATEGORY_LABELS: Category[] = ['Todos', 'Desechables', 'Líquidos', 'Accesorios']

const FALLBACK_PRODUCTS: Product[] = [
  { id: '1', name: 'Vape Bar Storm', price: 36000, type: 'Desechables', stock: 12 },
  { id: '2', name: 'Liquid Neon Blue', price: 29000, type: 'Líquidos', stock: 8 },
  { id: '3', name: 'Pod Pulse X', price: 42000, type: 'Accesorios', stock: 18 },
  { id: '4', name: 'Vape Bar Ruby', price: 36000, type: 'Desechables', stock: 14 },
  { id: '5', name: 'Liquid Midnight', price: 31000, type: 'Líquidos', stock: 10 },
  { id: '6', name: 'Cable Warp', price: 19000, type: 'Accesorios', stock: 20 },
  { id: '7', name: 'Vape Bar Ice', price: 36000, type: 'Desechables', stock: 11 },
  { id: '8', name: 'Liquid Solar', price: 33000, type: 'Líquidos', stock: 7 },
  { id: '9', name: 'Funda Shield', price: 24000, type: 'Accesorios', stock: 16 },
]

const formatPrice = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value)

export function POSDashboard() {
  const [activeCategory, setActiveCategory] = useState<Category>('Todos')
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [ticket, setTicket] = useState<{ product: Product; quantity: number }[]>([])
  const [selectedPayment, setSelectedPayment] = useState<'efectivo' | 'nequi' | 'datáfono'>('efectivo')
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      const supabase = createClient()
      if (!supabase) {
        setProducts(FALLBACK_PRODUCTS)
        setLoadingProducts(false)
        return
      }

      const { data } = await supabase
        .from('products')
        .select('id, name, brand, flavor, type, price, stock, is_active')
        .eq('is_active', true)

      if (data) {
        setProducts(
          (data as Product[])
            .filter((product) => CATEGORY_LABELS.includes(product.type))
            .map((product) => ({
              ...product,
              type: CATEGORY_LABELS.includes(product.type) ? product.type : 'Todos',
            })),
        )
      }

      setLoadingProducts(false)
    }

    void loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') return products
    return products.filter((product) => product.type === activeCategory)
  }, [activeCategory, products])

  const total = useMemo(
    () => ticket.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [ticket],
  )

  const addItem = (product: Product) => {
    if (product.stock <= 0) return

    setTicket((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...current, { product, quantity: 1 }]
    })
  }

  const changeQuantity = (productId: string, delta: number) => {
    setTicket((current) =>
      current
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (productId: string) => {
    setTicket((current) => current.filter((item) => item.product.id !== productId))
  }

  const finalizePurchase = async () => {
    if (ticket.length === 0 || isProcessing) return

    setIsProcessing(true)
    setMessage(null)

    const supabase = createClient()
    if (!supabase) {
      setMessage('No se pudo conectar con el servicio de stock. Revisa la configuración de Supabase.')
      setIsProcessing(false)
      return
    }

    try {
      const operations = ticket.map((item) => {
        const stockLeft = Math.max(0, item.product.stock - item.quantity)
        return supabase.from('products').update({ stock: stockLeft }).eq('id', item.product.id)
      })

      await Promise.all(operations)
      setMessage('Compra finalizada. Stock actualizado correctamente.')
      setTicket([])

      const { data } = await supabase
        .from('products')
        .select('id, name, brand, flavor, type, price, stock, is_active')
        .eq('is_active', true)

      if (data) {
        setProducts(
          (data as Product[])
            .filter((product) => CATEGORY_LABELS.includes(product.type))
            .map((product) => ({
              ...product,
              type: CATEGORY_LABELS.includes(product.type) ? product.type : 'Todos',
            })),
        )
      }
    } catch (error) {
      setMessage('Ocurrió un error al finalizar la compra. Intenta de nuevo.')
    }

    setIsProcessing(false)
  }

  return (
    <main className="h-screen overflow-hidden bg-[#030712] text-slate-100">
      <div className="grid h-full min-h-0 grid-cols-12 gap-6 px-5 py-5">
        <section className="col-span-12 flex min-h-0 flex-col gap-6 overflow-hidden rounded-[2rem] border border-blue-500/10 bg-[#030712] p-5 shadow-[0_0_60px_rgba(14,165,233,0.10)] lg:col-span-8">
          <div className="space-y-3 rounded-[1.75rem] border border-blue-500/20 bg-[#08101f]/90 p-5">
            <div className="flex flex-wrap gap-3">
              {CATEGORY_LABELS.map((category) => {
                const isActive = activeCategory === category
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-3xl border px-5 py-4 text-sm font-semibold transition ${
                      isActive
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-200'
                        : 'border-blue-500/30 bg-[#05101d] text-cyan-300'
                    } active:border-red-500 active:bg-red-500/10 active:text-white`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
            <div className="rounded-[1.75rem] border border-blue-500/20 bg-[#050c18]/90 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Panel de Productos</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Venta rápida</h2>
              <p className="mt-2 max-w-2xl text-slate-400">Toca un producto para sumar al ticket y ajusta cantidades en la mesa derecha.</p>
            </div>
          </div>

          <div className="grid h-full min-h-0 gap-4 overflow-auto pb-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addItem(product)}
                className="group flex h-44 flex-col justify-between rounded-[1.75rem] border border-blue-500/20 bg-[#0B0F19] p-5 text-left transition active:border-red-500 active:bg-red-500/10"
              >
                <div className="space-y-3">
                  <div className="h-28 rounded-3xl bg-gradient-to-br from-blue-700 via-slate-900 to-slate-800 p-4 text-white shadow-[0_15px_30px_rgba(14,165,233,0.15)]">
                    <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">{product.type}</p>
                    <p className="mt-3 text-xl font-semibold">{product.name}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Toque para agregar</span>
                  <span className="text-lg font-semibold text-cyan-300">{formatPrice(product.price)}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <aside className="col-span-12 flex h-full min-h-0 flex-col gap-6 rounded-[2rem] border border-blue-500/10 bg-slate-900 p-5 shadow-[-10px_0_30px_rgba(59,130,246,0.05)] lg:col-span-4">
          <div className="space-y-3 rounded-[1.75rem] border border-blue-500/20 bg-[#07101f]/90 p-5">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Ticket en vivo</p>
            <h2 className="text-3xl font-semibold text-white">Carrito POS</h2>
            <p className="text-slate-400">Ajusta cantidades rápidamente y cierra la venta con un solo toque.</p>
          </div>

          <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden rounded-[1.75rem] border border-blue-500/10 bg-[#050b14]/90">
            <div className="min-h-0 overflow-auto p-4">
              {ticket.length === 0 ? (
                <div className="flex h-64 items-center justify-center rounded-[1.5rem] border border-dashed border-blue-500/20 bg-[#07101f]/90 text-center text-slate-500">
                  <p className="px-6 text-sm">No hay artículos en el ticket. Toca cualquier producto para iniciar la venta.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ticket.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between gap-3 rounded-3xl border border-blue-500/10 bg-[#08111f]/90 p-4">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{item.product.name}</p>
                        <p className="text-sm text-slate-400">{formatPrice(item.product.price)}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-200">
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.product.id, -1)}
                          className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-red-500/30 bg-red-500/10 text-red-300 active:bg-red-500/20"
                        >
                          -
                        </button>
                        <span className="min-w-[2.5rem] text-center text-lg font-semibold text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.product.id, 1)}
                          className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 active:bg-cyan-400/20"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-red-500/30 bg-red-500/10 text-red-200 active:bg-red-500/20"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 rounded-[1.75rem] border border-blue-500/20 bg-[#07111e]/90 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Total</p>
              <span className="text-cyan-400 text-5xl font-bold">{formatPrice(total)}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setSelectedPayment('efectivo')}
                className={`rounded-[1.5rem] border px-4 py-5 text-left text-sm font-semibold transition active:bg-green-500/10 ${
                  selectedPayment === 'efectivo'
                    ? 'border-cyan-400 bg-cyan-400/10 text-cyan-100'
                    : 'border-slate-700 bg-[#030712] text-slate-200'
                }`}
              >
                <p className="text-2xl">💵 EFECTIVO</p>
                <p className="mt-2 text-xs text-slate-400">Cierre rápido de caja</p>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPayment('nequi')}
                className={`rounded-[1.5rem] border px-4 py-5 text-left text-sm font-semibold transition active:bg-red-500/10 ${
                  selectedPayment === 'nequi'
                    ? 'border-cyan-400 bg-gradient-to-r from-red-500/20 via-fuchsia-500/10 to-violet-600/10 text-slate-100'
                    : 'border-slate-700 bg-[#030712] text-slate-200'
                }`}
              >
                <p className="text-2xl">📱 NEQUI / TRANSFERENCIA</p>
                <p className="mt-2 text-xs text-slate-400">Recibo digital inmediato</p>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPayment('datáfono')}
                className={`rounded-[1.5rem] border px-4 py-5 text-left text-sm font-semibold transition active:bg-blue-500/10 ${
                  selectedPayment === 'datáfono'
                    ? 'border-cyan-400 bg-cyan-400/10 text-cyan-100'
                    : 'border-slate-700 bg-[#030712] text-slate-200'
                }`}
              >
                <p className="text-2xl">💳 DATÁFONO / TARJETA</p>
                <p className="mt-2 text-xs text-slate-400">Venta con terminal POS</p>
              </button>
              <div className="rounded-[1.5rem] border border-slate-700 bg-[#030712] p-4 text-sm text-slate-400">
                <p className="font-semibold text-slate-100">Método actual:</p>
                <p className="mt-2 text-sm text-slate-300">{selectedPayment === 'efectivo' ? 'EFECTIVO' : selectedPayment === 'nequi' ? 'NEQUI / TRANSFERENCIA' : 'DATÁFONO / TARJETA'}</p>
              </div>
            </div>
          </div>

          {message ? (
            <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
              {message}
            </div>
          ) : null}

          <button
            type="button"
            onClick={finalizePurchase}
            disabled={isProcessing || ticket.length === 0}
            className="mt-auto rounded-[2rem] bg-gradient-to-r from-cyan-400 via-blue-500 to-red-500 px-6 py-6 text-lg font-bold uppercase text-slate-950 shadow-[0_0_30px_rgba(59,130,246,0.35)] transition active:scale-[0.98] active:shadow-[0_0_15px_rgba(239,68,68,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Procesando compra...' : 'FINALIZAR COMPRA'}
          </button>
        </aside>
      </div>
    </main>
  )
}
