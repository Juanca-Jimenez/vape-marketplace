'use client'

import { useMemo, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { Product } from '@/components/tienda/ProductCard'

type CartItem = {
  product: Product
  quantity: number
}

type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia'

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: 'efectivo', label: 'Efectivo', icon: '💵' },
  { value: 'tarjeta', label: 'Tarjeta', icon: '💳' },
  { value: 'transferencia', label: 'Transferencia', icon: '📲' },
]

function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

function getSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function POSDashboard({ initialProducts = [] }: { initialProducts?: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts ?? [])
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState<string>('Todos')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const tipos = useMemo(() => {
    const unique = Array.from(new Set((products ?? []).map((p) => p.type).filter(Boolean)))
    return ['Todos', ...unique]
  }, [products])

  const productosFiltrados = useMemo(() => {
    return (products ?? []).filter((product) => {
      const coincideTipo = tipoFiltro === 'Todos' || product.type === tipoFiltro
      const coincideBusqueda = product.name.toLowerCase().includes(search.toLowerCase())
      return coincideTipo && coincideBusqueda
    })
  }, [products, tipoFiltro, search])

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  )

  const totalUnidades = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  )

  function addToCart(product: Product) {
    setError('')
    setSuccess('')
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      const cantidadActual = existing?.quantity ?? 0

      if (cantidadActual >= product.stock) return prev

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }

      return [...prev, { product, quantity: 1 }]
    })
  }

  function updateQuantity(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id !== productId) return item
          const nuevaCantidad = item.quantity + delta
          return { ...item, quantity: Math.min(Math.max(nuevaCantidad, 0), item.product.stock) }
        })
        .filter((item) => item.quantity > 0)
    )
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  function clearCart() {
    setCart([])
    setError('')
    setSuccess('')
  }

  async function confirmarVenta() {
    if (cart.length === 0) return

    setLoading(true)
    setError('')
    setSuccess('')

    const supabase = getSupabaseClient()

    const items = cart.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }))

    const { data: orderId, error: rpcError } = await supabase.rpc('process_pos_sale', {
      p_items: items,
      p_payment_method: paymentMethod,
    })

    if (rpcError) {
      setError(rpcError.message || 'No se pudo procesar la venta. Intenta de nuevo.')
      setLoading(false)
      return
    }

    setProducts((prev) =>
      (prev ?? []).map((product) => {
        const vendido = cart.find((item) => item.product.id === product.id)
        return vendido ? { ...product, stock: product.stock - vendido.quantity } : product
      })
    )

    setSuccess(`Venta registrada correctamente (orden ${String(orderId).slice(0, 8)}).`)
    setCart([])
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-white text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-center">
        <p className="text-xs font-medium sm:text-sm">
          🧾 Punto de venta —{' '}
          <span className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text font-semibold text-transparent">
            The V Society
          </span>
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
        {/* Columna productos */}
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-6 shadow-xl shadow-[rgba(37,99,235,0.08)]">
            <p className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-sm font-semibold uppercase tracking-[0.35em] text-transparent">
              Productos
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Selecciona lo que va a llevar el cliente</h1>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar producto..."
              className="mt-4 w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm outline-none transition focus:border-transparent focus:shadow-[0_0_0_3px_rgba(147,51,234,0.12)]"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {tipos.map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setTipoFiltro(tipo)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${tipoFiltro === tipo
                    ? 'bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] text-white shadow-md'
                    : 'border border-[#E2E8F0] text-[#475569] hover:border-[#9333EA]/40'
                    }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {productosFiltrados.length === 0 ? (
              <div className="col-span-full rounded-[2rem] border border-[#E2E8F0] bg-white p-10 text-center text-[#475569] shadow-lg shadow-[rgba(37,99,235,0.06)]">
                No hay productos disponibles con ese filtro.
              </div>
            ) : (
              productosFiltrados.map((product) => {
                const enCarrito = cart.find((item) => item.product.id === product.id)?.quantity ?? 0
                const disponible = product.stock - enCarrito

                return (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={disponible <= 0}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white text-left shadow-md shadow-[rgba(37,99,235,0.06)] transition hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    <div className="aspect-square w-full overflow-hidden bg-[#F8FAFC]">
                      {product.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-3xl">💨</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-3">
                      <p className="line-clamp-2 text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-[#475569]">{product.brand}</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <span className="text-sm font-bold text-[#0F172A]">{formatCOP(product.price)}</span>
                        <span className="text-[10px] font-medium text-[#475569]">Stock: {disponible}</span>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </section>

        {/* Columna carrito */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-8">
          <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-6 shadow-xl shadow-[rgba(37,99,235,0.08)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Venta actual</h2>
              {cart.length > 0 ? (
                <button onClick={clearCart} className="text-xs font-semibold text-[#DC2626] hover:underline">
                  Vaciar
                </button>
              ) : null}
            </div>

            {cart.length === 0 ? (
              <p className="mt-6 text-center text-sm text-[#475569]">
                Toca un producto para agregarlo a la venta.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between gap-2 rounded-xl border border-[#E2E8F0] p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{item.product.name}</p>
                      <p className="text-xs text-[#475569]">{formatCOP(item.product.price)} c/u</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E2E8F0] text-sm font-bold text-[#475569] hover:border-[#9333EA]/40"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E2E8F0] text-sm font-bold text-[#475569] hover:border-[#9333EA]/40 disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[#475569] hover:text-[#DC2626]"
                      aria-label={`Quitar ${item.product.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-2 border-t border-[#E2E8F0] pt-4">
              <div className="flex justify-between text-sm text-[#475569]">
                <span>Unidades</span>
                <span>{totalUnidades}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCOP(total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-6 shadow-xl shadow-[rgba(37,99,235,0.08)]">
            <h3 className="text-sm font-bold uppercase tracking-wide text-[#0F172A]">Método de pago</h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value)}
                  className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-semibold transition ${paymentMethod === method.value
                    ? 'border-transparent bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] text-white shadow-md'
                    : 'border-[#E2E8F0] text-[#475569] hover:border-[#9333EA]/40'
                    }`}
                >
                  <span className="text-lg">{method.icon}</span>
                  {method.label}
                </button>
              ))}
            </div>

            {error ? (
              <div className="mt-4 rounded-xl border border-[#DC2626]/20 bg-[#DC2626]/5 px-4 py-3 text-sm text-[#DC2626]">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            ) : null}

            <button
              onClick={confirmarVenta}
              disabled={cart.length === 0 || loading}
              className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? 'Procesando...' : `Confirmar venta · ${formatCOP(total)}`}
            </button>
          </div>
        </aside>
      </div>
    </main>
  )
}