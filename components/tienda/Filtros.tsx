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
      <p className="text-sm font-semibold text-slate-200">{label}</p>
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
                  ? 'border-[#00F5FF] bg-[#00F5FF]/10 text-[#00F5FF] shadow-[0_0_12px_rgba(0,245,255,0.12)]'
                  : 'border-slate-700 bg-[#030712]/80 text-slate-300 hover:border-[#00F5FF]/50 hover:text-[#00F5FF]'
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
    <aside className="rounded-3xl border border-[#3B82F6]/20 bg-[#0B0F19]/95 p-5 shadow-[0_0_18px_rgba(59,130,246,0.12)]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Filtros</h2>
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm text-slate-400 transition hover:text-[#00F5FF]"
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
