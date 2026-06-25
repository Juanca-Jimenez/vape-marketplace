'use client'

export default function LimpiarCookiePage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Limpiar Cookies</h1>
        <p className="text-zinc-400 mb-6">
          Haz clic en el botón para limpiar todas las cookies y volver a la pantalla de verificación de edad.
        </p>
        <button
          onClick={() => {
            document.cookie = 'age_verified=; path=/; max-age=0'
            window.location.href = '/'
          }}
          className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition"
        >
          Limpiar Cookie y Reiniciar
        </button>
      </div>
    </main>
  )
}
