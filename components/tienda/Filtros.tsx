'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface FiltrosProps {
  marcas: string[]
  sabores: string[]
  tipos: string[]
}

export function Filtros({ marcas, sabores, tipos }: FiltrosProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentMarca = searchParams.get('marca') ?? ''
  const currentSabor = searchParams.get('sabor') ?? ''
  const currentTipo = searchParams.get('tipo') ?? ''

  const applyFilter = (key: 'marca' | 'sabor' | 'tipo', value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/tienda?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/tienda')
  }

  const renderPills = (label: string, values: string[], activeValue: string, key: 'marca' | 'sabor' | 'tipo') => (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-zinc-200">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => {
          const isActive = activeValue === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => applyFilter(key, isActive ? '' : value)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                isActive
                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 hover:text-white'
              }`}
            >
              {value}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <aside className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Filtros</h2>
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm text-zinc-400 transition hover:text-white"
        >
          Limpiar
        </button>
      </div>

      <div className="mt-6 space-y-6">
        {renderPills('Marca', marcas, currentMarca, 'marca')}
        {renderPills('Sabor', sabores, currentSabor, 'sabor')}
        {renderPills('Tipo', tipos, currentTipo, 'tipo')}
      </div>
    </aside>
  )
}
