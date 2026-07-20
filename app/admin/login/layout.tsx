// Layout vacío para /admin/login — anula el layout padre de /admin
// para que la página de login sea accesible sin autenticación previa.
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
