'use client'

import { useState } from 'react'

export interface ProductFormData {
  name: string
  brand: string
  flavor: string
  type: string
  price: string
  cost: string
  stock: string
  alert_threshold: string
  description: string
  is_active: boolean
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  loading: boolean
  onSubmit: (data: ProductFormData, imageFile?: File | null) => Promise<void>
}

export function ProductForm({ initialData, loading, onSubmit }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [brand, setBrand] = useState(initialData?.brand ?? '')
  const [flavor, setFlavor] = useState(initialData?.flavor ?? '')
  const [type, setType] = useState(initialData?.type ?? 'Desechable')
  const [price, setPrice] = useState(initialData?.price ?? '0')
  const [cost, setCost] = useState(initialData?.cost ?? '0')
  const [stock, setStock] = useState(initialData?.stock ?? '0')
  const [alertThreshold, setAlertThreshold] = useState(initialData?.alert_threshold ?? '5')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (!name || !brand || !type) {
      setError('Completa los campos obligatorios.')
      return
    }

    await onSubmit(
      {
        name,
        brand,
        flavor,
        type,
        price,
        cost,
        stock,
        alert_threshold: alertThreshold,
        description,
        is_active: isActive,
      },
      imageFile
    )
  }

  const inputClass = "w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] outline-none transition focus:border-transparent focus:shadow-[0_0_0_3px_rgba(147,51,234,0.12)]"

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border border-[#E2E8F0] bg-white p-8 shadow-xl shadow-[rgba(37,99,235,0.06)]">
      {error ? <p className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Nombre</label>
          <input required value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Marca</label>
          <input required value={brand} onChange={(event) => setBrand(event.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Sabor</label>
          <input value={flavor} onChange={(event) => setFlavor(event.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Tipo</label>
          <select value={type} onChange={(event) => setType(event.target.value)} className={inputClass}>
            <option value="Desechable">Desechable</option>
            <option value="Pod recargable">Pod recargable</option>
            <option value="Mod">Mod</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Precio de venta</label>
          <input type="number" min="0" required value={price} onChange={(event) => setPrice(event.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Costo</label>
          <input type="number" min="0" value={cost} onChange={(event) => setCost(event.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Stock</label>
          <input type="number" min="0" required value={stock} onChange={(event) => setStock(event.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Umbral alerta stock</label>
          <input type="number" min="0" value={alertThreshold} onChange={(event) => setAlertThreshold(event.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Descripción</label>
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} className={`${inputClass} min-h-24`} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#0F172A]">Imagen</label>
        <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} className={inputClass} />
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
        <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} className="h-4 w-4 rounded border-[#E2E8F0] text-[#2563EB]" />
        Activo
      </label>

      <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-[length:200%_100%] bg-[position:0%_0%] px-6 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:bg-[position:100%_0%] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100">
        {loading ? 'Guardando...' : 'Guardar producto'}
      </button>
    </form>
  )
}
