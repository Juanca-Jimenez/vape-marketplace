'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface FiltrosProps {
  marcas: string[]
  sabores: string[]
  tipos: string[]
}

type FilterKey = 'marca' | 'sabor' | 'tipo'

const FILTER_LABELS: Record<FilterKey, string> = {
  marca: 'Marca',
  sabor: 'Sabor',
  tipo: 'Tipo',
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={`h-4 w-4 text-[#475569] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M3 4.5h14M6 10h8M8.5 15.5h3"
        stroke="url(#filterGradient)"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="filterGradient" x1="0" y1="0" x2="20" y2="0">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3">
      <path
        d="M5 5L15 15M15 5L5 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Filtros({ marcas, sabores, tipos }: FiltrosProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [openSections, setOpenSections] = useState<Record<FilterKey, boolean>>({
    marca: true,
    sabor: true,
    tipo: true,
  })

  const current: Record<FilterKey, string> = {
    marca: searchParams.get('marca') ?? '',
    sabor: searchParams.get('sabor') ?? '',
    tipo: searchParams.get('tipo') ?? '',
  }

  const activeFilters = (Object.keys(current) as FilterKey[]).filter((key) => current[key])

  const applyFilter = (key: FilterKey, value: string) => {
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

  const toggleSection = (key: FilterKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const renderSection = (key: FilterKey, values: string[]) => {
    if (values.length === 0) return null

    const isOpen = openSections[key]
    const activeValue = current[key]

    return (
      <div className="py-4 first:pt-0 last:pb-0">
        <button
          type="button"
          onClick={() => toggleSection(key)}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
            {FILTER_LABELS[key]}
            {activeValue && (
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626]" />
            )}
          </span>
          <ChevronIcon open={isOpen} />
        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const isActive = activeValue === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => applyFilter(key, isActive ? '' : value)}
                    aria-pressed={isActive}
                    className={`rounded-full px-3.5 py-1.5 text-[0.8rem] font-medium transition-all duration-200 ${isActive
                        ? 'bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] text-white shadow-sm shadow-[rgba(147,51,234,0.25)]'
                        : 'border border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] hover:border-[#CBD5E1] hover:bg-white hover:text-[#0F172A]'
                      }`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <aside className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
        <div className="flex items-center gap-2">
          <FilterIcon />
          <h2 className="text-sm font-bold text-[#0F172A]">Filtrar productos</h2>
        </div>

        {activeFilters.length > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-[#475569] transition-colors hover:text-[#DC2626]"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Chips de filtros activos */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-b border-[#E2E8F0] px-5 py-3">
          {activeFilters.map((key) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#F8FAFC] py-1 pl-3 pr-1.5 text-xs font-medium text-[#0F172A]"
            >
              <span className="text-[#475569]">{FILTER_LABELS[key]}:</span>
              {current[key]}
              <button
                type="button"
                onClick={() => applyFilter(key, '')}
                aria-label={`Quitar filtro de ${FILTER_LABELS[key]}`}
                className="flex h-4 w-4 items-center justify-center rounded-full text-[#94A3B8] transition-colors hover:bg-[#E2E8F0] hover:text-[#DC2626]"
              >
                <CloseIcon />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Secciones de filtro */}
      <div className="divide-y divide-[#E2E8F0] px-5">
        {renderSection('marca', marcas)}
        {renderSection('sabor', sabores)}
        {renderSection('tipo', tipos)}
      </div>

      <div className="h-1" />
    </aside>
  )
}