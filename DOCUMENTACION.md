# DOCUMENTACION

## RESUMEN EJECUTIVO
El proyecto es un marketplace de productos vape orientado a usuarios mayores de 18 años, con acceso controlado, catálogo de productos, filtros de búsqueda y carrito de compras persistente. Está pensado para ofrecer una experiencia de compra sencilla y visualmente moderna en un entorno web.

## ARQUITECTURA
- Frontend: Next.js 16.2.9 con React 19.2.4 y TypeScript
- Backend: Next.js server runtime + Laravel Livewire (PHP) en componentes heredados
- Base de datos: PostgreSQL a través de Supabase
- API: REST mediante Supabase

## FUNCIONALIDADES PRINCIPALES
- Verificación de edad con gate de acceso y cookie de sesión ✅
- Redirección inicial a la pantalla de verificación ✅
- Catálogo de productos cargado desde Supabase ✅
- Búsqueda por nombre en el catálogo ✅
- Filtrado por marca, sabor y tipo ✅
- Vista de productos con estado de stock y botón de agregar al carrito ✅
- Carrito con contador, total y persistencia en almacenamiento local ✅
- Edición de cantidades, eliminación de artículos y vaciado del carrito ✅
- Registro de verificaciones de edad en Supabase ✅
- Página de limpieza de cookies para reiniciar la experiencia ✅

## COMPONENTES CLAVE
- Navbar: barra superior con enlaces de catálogo y carrito
- CartProvider: contexto global del carrito y lógica de persistencia
- CartButton: botón flotante de acceso al carrito con contador
- Filtros: panel de filtros del catálogo por marca, sabor y tipo
- ProductCard: tarjeta de producto con información, stock y acción de agregar
- middleware.ts: protección de rutas por verificación de edad
- app/tienda/page.tsx: consulta y renderizado del catálogo con filtros
- app/verificar-edad/page.tsx: validación de edad y registro de verificación
- app/Http/Livewire/CartButton.php: contador de carrito en la capa Livewire
- lib/supabase/server.ts: cliente de Supabase para renderizado del lado servidor

## DEPENDENCIAS PRINCIPALES
- next
- react
- react-dom
- @supabase/ssr
- @supabase/supabase-js
- zustand
- tailwindcss
- @tailwindcss/postcss
- eslint
- eslint-config-next

## ESTADO ACTUAL
- Rama principal: develop
- Último commit: 2026-06-25 — moficaciones al carrito, filtros arreglados y mensaje de cantidad
- Deuda técnica conocida:
  - El carrito está persistido solo en el navegador, sin integración de backend o checkout
  - La verificación de edad depende de cookies del cliente y no de un sistema de autenticación robusto
  - El catálogo requiere que Supabase esté correctamente configurado para funcionar
  - Existen componentes heredados de Livewire que no están plenamente integrados con la arquitectura actual
  - No hay flujo de pagos, pedidos ni gestión de usuarios implementado
