# The V Society

Marketplace especializado en productos de vapeo desarrollado con **Next.js 15**, **TypeScript** y **Supabase**, diseñado para gestionar de forma centralizada el catálogo de productos, inventario, pedidos, ventas y operaciones de punto de venta (POS).

La plataforma combina una experiencia moderna para clientes con herramientas administrativas para la operación diaria del negocio, implementando autenticación segura, autorización basada en roles y una arquitectura escalable basada en Server Components y Server Actions.

---

## Tabla de Contenido

* Descripción
* Características
* Arquitectura
* Tecnologías
* Funcionalidades
* Sistema de Roles
* Seguridad
* Base de Datos
* Instalación
* Variables de Entorno
* Desarrollo
* Despliegue
* Requerimientos No Funcionales

---

# Descripción

The V Society es una plataforma web orientada a la comercialización y gestión de productos de vapeo.

El sistema permite:

* Gestión de catálogo.
* Control de inventario.
* Administración de pedidos.
* Ventas desde tienda virtual.
* Operación mediante POS.
* Administración mediante panel privado.
* Control de acceso basado en roles.
* Integración completa con Supabase.

La solución fue desarrollada siguiendo principios de escalabilidad, seguridad, mantenibilidad y rendimiento.

---

# Características Principales

## Para Clientes

* Verificación obligatoria de mayoría de edad.
* Navegación de catálogo.
* Búsqueda de productos.
* Filtros avanzados.
* Carrito de compras.
* Checkout.
* Consulta de disponibilidad.

## Para Administradores

* Gestión de productos.
* Gestión de inventario.
* Gestión de pedidos.
* Administración del catálogo.
* Control de accesos.

## Para Operadores POS

* Registro de ventas.
* Consulta de productos.
* Operación de punto de venta.

---

# Arquitectura

La aplicación utiliza una arquitectura moderna basada en el ecosistema de Next.js y Supabase.

```text
┌─────────────────────┐
│      Usuario        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Next.js 15      │
│    App Router       │
└──────────┬──────────┘
           │
 ┌─────────┼─────────┐
 │         │         │
 ▼         ▼         ▼
Server   Client   Server
Comp.    Comp.   Actions
 │         │         │
 └─────────┴─────────┘
           │
           ▼
┌─────────────────────┐
│   Middleware        │
│  Control Acceso     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      Supabase       │
├─────────────────────┤
│ Authentication      │
│ PostgreSQL          │
│ Storage             │
│ Row Level Security  │
└─────────────────────┘
```

---

# Stack Tecnológico

## Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS

## Backend

* Supabase
* PostgreSQL

## Estado Global

* Zustand

## Autenticación

* Supabase Auth

## Almacenamiento

* Supabase Storage

## Observabilidad

* Vercel Analytics
* Vercel Speed Insights

## Control de Versiones

* Git
* GitHub

---

# Funcionalidades

## Catálogo

* Listado de productos activos.
* Búsqueda por nombre.
* Filtro por marca.
* Filtro por sabor.
* Filtro por tipo.
* Visualización de stock.

## Carrito

* Agregar productos.
* Eliminar productos.
* Actualizar cantidades.
* Cálculo automático de totales.

## Checkout

* Resumen del pedido.
* Validación de información.
* Confirmación de compra.

## Administración

* Gestión de productos.
* Gestión de stock.
* Administración de pedidos.
* Configuración operativa.

## POS

* Ventas rápidas.
* Consulta de inventario.
* Registro de transacciones.

---

# Sistema de Roles

La autorización se basa en la tabla:

```text
profiles
```

Roles disponibles:

```text
admin
pos
customer
```

## Admin

Acceso completo al sistema administrativo.

```text
/admin
```

---

## POS

Acceso exclusivo al módulo de punto de venta.

```text
/pos
```

---

## Customer

Acceso a:

```text
/tienda
/carrito
/checkout
```

---

# Seguridad

El sistema implementa múltiples mecanismos de protección:

### Verificación de Edad

Acceso restringido a mayores de edad.

### Autenticación

Implementada mediante Supabase Auth.

### Control de Acceso

Protección mediante:

```text
proxy.ts
```

Validando:

* Sesión activa.
* Rol autorizado.

### Protección de Datos

* Variables sensibles protegidas.
* Uso de Row Level Security.
* Credenciales no expuestas al cliente.

### Integridad del Inventario

Restricciones a nivel de base de datos para evitar stock negativo.

---

# Base de Datos

La solución utiliza PostgreSQL administrado por Supabase.

Principales entidades:

```text
profiles
products
orders
order_items
```

El sistema utiliza índices para optimizar:

* Marca.
* Sabor.
* Tipo.
* Búsqueda por nombre.

---

# Instalación

## Clonar repositorio

```bash
git clone <url-repositorio>
```

## Entrar al proyecto

```bash
cd vape-marketplace
```

## Instalar dependencias

```bash
npm install
```

## Configurar variables de entorno

Crear:

```env
.env.local
```

Agregar:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

# Desarrollo

Ejecutar:

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000
```

---

# Despliegue

Generar build:

```bash
npm run build
```

Ejecutar:

```bash
npm start
```

La aplicación está preparada para despliegue en:

* Vercel
* Supabase

---

# Requerimientos No Funcionales Cubiertos

### Rendimiento

* Server Components.
* Índices PostgreSQL.
* Vercel Speed Insights.

### Compatibilidad

* Chrome.
* Firefox.
* Edge.

### Seguridad

* Supabase Auth.
* Control por roles.
* RLS.
* Protección de rutas.

### Mantenibilidad

* Arquitectura modular.
* TypeScript.
* Organización por dominios.

### Portabilidad

* GitHub.
* Herramientas Open Source.
