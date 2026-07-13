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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Nombre</label>
          <input required value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Marca</label>
          <input required value={brand} onChange={(event) => setBrand(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Sabor</label>
          <input value={flavor} onChange={(event) => setFlavor(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Tipo</label>
          <select value={type} onChange={(event) => setType(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white">
            <option value="Desechable">Desechable</option>
            <option value="Pod recargable">Pod recargable</option>
            <option value="Mod">Mod</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Precio de venta</label>
          <input type="number" min="0" required value={price} onChange={(event) => setPrice(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Costo</label>
          <input type="number" min="0" value={cost} onChange={(event) => setCost(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Stock</label>
          <input type="number" min="0" required value={stock} onChange={(event) => setStock(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Umbral alerta stock</label>
          <input type="number" min="0" value={alertThreshold} onChange={(event) => setAlertThreshold(event.target.value)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-300">Descripción</label>
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-24 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-300">Imagen</label>
        <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
        Activo
      </label>

      <button type="submit" disabled={loading} className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? 'Guardando...' : 'Guardar producto'}
      </button>
    </form>
  )
}
