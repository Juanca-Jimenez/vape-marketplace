'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  show: boolean
  duration?: number
}

export function Toast({ message, show, duration = 2000 }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!show) {
      setVisible(false)
      return
    }

    setVisible(true)
    const timer = window.setTimeout(() => setVisible(false), duration)

    return () => window.clearTimeout(timer)
  }, [duration, show])

  if (!visible) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] rounded-2xl border border-emerald-500/30 bg-zinc-900/95 px-4 py-3 text-sm font-medium text-emerald-300 shadow-lg shadow-black/30">
      {message}
    </div>
  )
}
