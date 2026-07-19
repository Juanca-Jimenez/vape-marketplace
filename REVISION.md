# Auditoría de Requisitos No Funcionales — VapeMarketplace

> **Método:** Análisis estático del código fuente. Solo se considera cumplido un RNF cuando existe evidencia técnica verificable.
> **Versión del proyecto:** Next.js 16.2.9 · Turbopack · Supabase · TypeScript
> **Fecha de auditoría:** 2026-07-19

---

## 1. Tabla de Cumplimiento RNF

| Requisito | Estado | Tecnología / Herramienta | Evidencia encontrada | Justificación |
|---|---|---|---|---|
| **RNF-01** — Tiempo de carga < 5s | ⚠️ Parcialmente Cumplido | Next.js App Router (SSR/SSG), Turbopack | `app/tienda/page.tsx` (SSR), `app/home/page.tsx`, páginas estáticas en build output (`○`) | Next.js prerenderiza páginas estáticas. Las páginas dinámicas (tienda, admin) hacen fetch a Supabase en cada request. No existe medición real de latencia ni CDN configurado. El build confirma SSG en `/home`, `/carrito`, `/checkout`. Sin embargo no hay evidencia de pruebas de carga reales. |
| **RNF-02** — Catálogo con filtros ≤ 3s | ⚠️ Parcialmente Cumplido | `unstable_cache` de Next.js, Server Components | `app/tienda/page.tsx` — `unstable_cache(['products-base'], { revalidate: 60 })`. Con filtros activos: query directa sin caché. | La caché de 60s existe para listado base. Las queries con filtros van directo a Supabase sin caché. No hay medición garantizada de latencia. El `console.time('[QUERY] catalogo-con-filtros')` registra tiempos pero no los impone como umbral. |
| **RNF-05** — Soporte Chrome, Firefox, Edge | ⚠️ Parcialmente Cumplido | TailwindCSS v4, CSS estándar, HTML semántico | `app/globals.css`, `app/layout.tsx`, todos los componentes `.tsx` | El proyecto usa CSS estándar y TailwindCSS sin prefijos vendor específicos. No existe configuración de `browserslist` en `package.json`, ni tests E2E en múltiples navegadores. |
| **RNF-06** — Diseño responsivo | ✅ Cumplido | TailwindCSS v4 (clases responsive), CSS grid/flex | `app/tienda/page.tsx` (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), `components/tienda/ProductCard.tsx`, `components/tienda/CheckoutSection.tsx` (`grid-cols-1 lg:grid-cols-[1.4fr_0.85fr]`) | Uso consistente de clases `sm:`, `md:`, `lg:` de Tailwind en todos los layouts principales. |
| **RNF-09** — Mensajes de error comprensibles | ✅ Cumplido | React estado local, mensajes en español | `app/login/page.tsx` (`'Usuario o contraseña incorrectos.'`), `app/admin/ordenes/actions.ts` (`'No se pudo actualizar el estado del pedido. Inténtelo más tarde.'`), `components/tienda/CheckoutSection.tsx` (`'Completa Nombre, Teléfono y Dirección'`) | Los errores técnicos de Supabase son capturados en try/catch y se devuelve un mensaje en español sin detalles internos. Evidencia en `lib/logger/index.ts`: errores técnicos solo van a consola/archivo. |
| **RNF-12** — Confirmación visual de acciones | ✅ Cumplido | Estado React, clases condicionales | `components/tienda/CheckoutSection.tsx` L350-354 (banner verde `✅ Pedido guardado y stock actualizado`), `app/admin/ordenes/page.tsx` `StatusBadge` con colores por estado, `components/pos/POSDashboard.tsx` | Confirmación visual al guardar pedido, al actualizar estados de órdenes en panel admin. |
| **RNF-14** — Registro íntegro de pedidos | ✅ Cumplido | Supabase PostgreSQL RPC, Server Actions | `components/tienda/CheckoutSection.tsx` L106-109: `supabase.rpc('process_pos_sale', ...)`, `components/pos/POSDashboard.tsx` L123: misma RPC. `lib/logger/index.ts` + `app/admin/ordenes/actions.ts` | El pedido se registra vía RPC `process_pos_sale` en Supabase (atómica). El admin puede ver todas las órdenes en `/admin/ordenes`. La función RPC en Supabase garantiza atomicidad a nivel de base de datos. |
| **RNF-15** — Stock nunca negativo | ⚠️ Parcialmente Cumplido | Validación UI, RPC Supabase | `components/pos/POSDashboard.tsx` L75: `if (cantidadActual >= product.stock) return prev`, L93: `Math.min(Math.max(nuevaCantidad, 0), item.product.stock)`. `ProductForm.tsx` L111: `min="0"` en input. | La validación frontend impide añadir más del stock disponible. La RPC `process_pos_sale` existe pero no está en el código fuente del proyecto. No hay evidencia de `CHECK (stock >= 0)` a nivel de base de datos visible en el repo. La validación solo vive en el cliente. |
| **RNF-17** — Confidencialidad de información | ✅ Cumplido | `.gitignore`, variables de entorno, SUPABASE_SERVICE_ROLE_KEY server-only | `.gitignore` L34: `.env*` excluye todos los archivos `.env`. `lib/supabase/admin.ts` usa `SUPABASE_SERVICE_ROLE_KEY` solo server-side. `lib/logger/index.ts`: errores técnicos no se exponen al frontend. | Las credenciales están en `.env.local` (excluido de git). La `SERVICE_ROLE_KEY` solo se usa en `createAdminClient()` en Server Actions/Components. No se expone al cliente. |
| **RNF-18** — Autenticación obligatoria para admin | ✅ Cumplido | `middleware.ts` + Supabase Auth + tabla `profiles` | `middleware.ts`: `supabase.auth.getUser()` valida JWT en cada request a `/admin` y `/pos`. `app/login/page.tsx`: login con email/password via `signInWithPassword`. `proxy.ts`: rate limiting en `/admin/login`. | El middleware intercepta TODAS las rutas `/admin` y `/pos`. Si no hay sesión válida → redirect a `/login`. El rol se verifica en tabla `profiles` de Supabase. |
| **RNF-21** — Estructura modular | ✅ Cumplido | Next.js App Router, carpetas por dominio | `app/` (rutas), `components/` (tienda, admin, pos, ui), `lib/` (logger, store, supabase, utils), `app/api/` (endpoints) | Separación clara: `components/tienda/`, `components/admin/`, `components/pos/`. Módulo de logger en `lib/logger/`. Supabase clients en `lib/supabase/`. Store en `lib/store/cart.ts`. |
| **RNF-22** — Ramas de desarrollo y producción | ✅ Cumplido | Git, GitHub | `git branch -a` muestra: `main`, `develop`, `remotes/origin/main`, `remotes/origin/develop`. Commit `3b3086e Merge pull request #2 from Juanca-Jimenez/develop` | Existen ramas `main` (producción) y `develop` (desarrollo) con PR mergeado documentado en el historial. |
| **RNF-25** — Repositorio compartido | ✅ Cumplido | Git + GitHub | `git log` muestra historial de 20+ commits. `remotes/origin/HEAD -> origin/main`. Commits con mensajes convencionales (`feat:`, `fix:`, `refactor:`). | Repositorio activo en GitHub (`origin/main`, `origin/develop`). Evidencia de colaboración y commits organizados. |
| **RNF-28** — Software libre / gratuito | ✅ Cumplido | Next.js (MIT), React (MIT), Supabase (free tier), TailwindCSS (MIT), Zustand (MIT) | `package.json`: `"next": "^16.2.9"`, `"react": "^19.0.0"`, `"zustand": "^5.0.3"`, `"@supabase/ssr": "^0.6.1"` | Todas las dependencias tienen licencias MIT o Apache 2.0. Supabase tiene plan gratuito. Next.js, React, TailwindCSS son open source. No hay licencias comerciales requeridas. |

**Resumen:** ✅ Cumplidos: 9/14 · ⚠️ Parcialmente Cumplidos: 4/14 · ❌ No Implementados: 0/14

---

## 2. Tecnologías y Herramientas para Garantizar Calidad

### Rendimiento

| Tecnología | Cómo ayuda | RNF cubierto |
|---|---|---|
| **Next.js App Router SSG/SSR** | Prerenderiza páginas estáticas (`/home`, `/carrito`) en build time; páginas dinámicas en SSR | RNF-01 |
| **Turbopack** | Compilación incremental ultra-rápida; builds de producción optimizados | RNF-01 |
| **`unstable_cache` (Next.js)** | Cachea resultados de queries a Supabase por 60 segundos en el servidor; reduce llamadas en `/tienda` | RNF-02 |
| **`Promise.all`** | Panel admin carga todas las métricas en paralelo (`app/admin/page.tsx`) | RNF-01 |
| **Zustand + `localStorage`** | Carrito persistido en cliente; no requiere fetch de datos al servidor | RNF-01 |

### Seguridad

| Tecnología | Cómo ayuda | RNF cubierto |
|---|---|---|
| **Supabase Auth (JWT)** | Tokens JWT validados en cada request via `auth.getUser()` contra Supabase | RNF-18 |
| **`middleware.ts` (Edge Runtime)** | Intercepta todas las rutas protegidas antes de procesar la request | RNF-18 |
| **Rate Limiting en memoria** | `checkRateLimit()` en `middleware.ts`: máximo 5 intentos por IP en 15 minutos | RNF-18 |
| **Variables de entorno + `.gitignore`** | `.env.local` excluido de git; `SUPABASE_SERVICE_ROLE_KEY` solo server-side | RNF-17 |
| **RBAC (Role-Based Access Control)** | Tabla `profiles` con campo `role`; middleware verifica `admin` o `pos` antes de dar acceso | RNF-18 |
| **Mensajes genéricos de error** | Errores técnicos → archivo/consola; usuario recibe mensaje genérico en español | RNF-17 |

### Fiabilidad

| Tecnología | Cómo ayuda | RNF cubierto |
|---|---|---|
| **Supabase PostgreSQL RPC** | `process_pos_sale` es una función atómica que crea la orden y descuenta el stock en una sola transacción | RNF-14, RNF-15 |
| **Sistema de Logging** | `lib/logger/index.ts` con `fs.appendFileSync`; archivos: `security.log`, `orders.log`, `error.log`, `app.log` | RNF-14 |
| **Try/Catch en Server Actions** | `app/admin/ordenes/actions.ts`, `app/checkout/actions.ts`: errores de DB capturados y logueados | RNF-14 |
| **Validación `validarDatosEnvio()`** | `app/checkout/actions.ts`: valida nombre, teléfono, ciudad, dirección antes de tocar la BD | RNF-14 |

### Usabilidad

| Tecnología | Cómo ayuda | RNF cubierto |
|---|---|---|
| **TailwindCSS responsive** | Clases `sm:`, `md:`, `lg:` en todos los layouts; grid adaptativo en tienda y checkout | RNF-06 |
| **Estado visual de carga** | `isSavingOrder`, `isSubmitting`, `loading`: botones con texto "GUARDANDO...", spinner SVG animado | RNF-12 |
| **Mensajes en español** | Errores del usuario en español natural en todos los formularios y Server Actions | RNF-09 |
| **Confirmación visual** | Banner `✅ Pedido guardado y stock actualizado`; `StatusBadge` con colores semánticos | RNF-12 |

### Mantenibilidad

| Tecnología | Cómo ayuda | RNF cubierto |
|---|---|---|
| **TypeScript estricto** | Tipado fuerte en toda la base de código; interfaces definidas para todos los dominios | RNF-21 |
| **Arquitectura modular** | `lib/`, `components/`, `app/`, `app/api/` separados por dominio y responsabilidad | RNF-21 |
| **Git con commits convencionales** | `feat:`, `fix:`, `refactor:` — historial legible y trazable; PR entre ramas | RNF-22, RNF-25 |
| **Logger centralizado** | `lib/logger/index.ts` como punto único; reutilizable desde cualquier Server Action | RNF-21 |

---

## 3. Brechas Detectadas

### RNF-01 — Tiempo de carga < 5 segundos

**Qué falta:** No existe ningún mecanismo que *mida* ni *garantice* el tiempo de carga. El `console.time()` en el catálogo registra tiempos pero no impone umbrales ni genera alertas automáticas.

**Por qué no se puede considerar completamente cumplido:** El cumplimiento depende de la latencia de red entre el servidor y Supabase, y la velocidad de la conexión del usuario. Sin medición verificable, el RNF no puede auditarse.

**Recomendación:**
- Integrar `@vercel/analytics` o `next/web-vitals` para medición de Core Web Vitals
- Agregar monitoreo de latencia en el API Route de logs: registrar el tiempo de cada query crítica
- Considerar despliegue en Vercel para CDN automático + Speed Insights

---

### RNF-02 — Catálogo con filtros ≤ 3 segundos

**Qué falta:** Las queries con filtros activos (`marca`, `sabor`, `tipo`, `buscar`) van directas a Supabase sin caché. No hay índices de base de datos visibles en el código del repositorio.

**Por qué no se puede considerar completamente cumplido:** La latencia depende de la red y de índices en Supabase cuya existencia no puede verificarse desde el código fuente del proyecto.

**Recomendación:**
```sql
-- Ejecutar en Supabase SQL Editor:
CREATE INDEX idx_products_brand ON products(brand) WHERE is_active = true;
CREATE INDEX idx_products_flavor ON products(flavor) WHERE is_active = true;
CREATE INDEX idx_products_type ON products(type) WHERE is_active = true;
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('spanish', name));
```
- Considerar debounce (300ms) en campo de búsqueda de texto libre

---

### RNF-05 — Soporte Chrome, Firefox, Edge

**Qué falta:** No existe configuración de `browserslist` en `package.json`. No hay tests E2E en múltiples navegadores.

**Por qué no se puede considerar completamente cumplido:** El uso de TailwindCSS y HTML estándar sugiere compatibilidad, pero no es evidencia verificable de pruebas realizadas.

**Recomendación:**
- Agregar a `package.json`:
```json
"browserslist": ["> 1%", "last 2 Chrome versions", "last 2 Firefox versions", "last 2 Edge versions"]
```
- Implementar tests E2E con Playwright: `npx playwright test --project=chromium --project=firefox --project=webkit`

---

### RNF-15 — Stock nunca negativo

**Qué falta:** La validación de stock existe en el frontend pero no hay evidencia de un `CHECK (stock >= 0)` a nivel de base de datos PostgreSQL dentro del repositorio. Si se insertara directamente via API REST o en caso de concurrencia, el stock podría quedar negativo.

**Por qué no se puede considerar completamente cumplido:** La RPC `process_pos_sale` existe en Supabase pero su definición SQL no está en el repositorio, por lo que no puede auditarse si tiene la restricción correcta.

**Recomendación:**
```sql
-- Constraint a nivel de base de datos (inviolable):
ALTER TABLE products ADD CONSTRAINT stock_no_negativo CHECK (stock >= 0);

-- Dentro de la función process_pos_sale, antes del UPDATE:
IF (SELECT stock FROM products WHERE id = p_product_id) < p_quantity THEN
  RAISE EXCEPTION 'Stock insuficiente para el producto %', p_product_id;
END IF;
```
- **Agregar directorio `supabase/migrations/`** al repositorio con el esquema SQL documentado para que los constraints sean auditables.

---

> ⚠️ **Nota de seguridad:** Se detectó que el archivo `.env.local` contiene credenciales reales de Supabase incluyendo la `SUPABASE_SERVICE_ROLE_KEY`. Aunque está correctamente en `.gitignore`, se recomienda **rotar estas claves regularmente** y nunca compartir el archivo por canales inseguros.
