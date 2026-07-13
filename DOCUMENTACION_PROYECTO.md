# Documentación del proyecto Vape Marketplace

## 1. Descripción general

Vape Marketplace es una aplicación web desarrollada con Next.js, React, TypeScript, Tailwind CSS y Supabase para gestionar la experiencia de compra de productos de vape. El proyecto combina un frontend comercial para clientes con un área protegida para administración.

El sistema actual permite:
- mostrar una pantalla de verificación de edad antes de entrar al sitio,
- navegar un catálogo de productos con filtros y búsqueda,
- ver detalles de cada producto,
- agregar productos al carrito,
- revisar el resumen del pedido,
- completar un checkout y enviar el pedido por WhatsApp,
- acceder al panel de administración mediante autenticación.

## 2. Objetivo del proyecto

Ofrecer una experiencia de compra simple, visual y segura para clientes mayores de edad, mientras proporciona una base funcional para la administración de productos y pedidos.

## 3. Tecnologías utilizadas

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Zustand para manejo del carrito
- Supabase para autenticación, almacenamiento y datos del negocio
- Middleware de Next.js para protección de rutas y validación de edad

## 4. Módulos y funcionalidades actuales

### 4.1 Acceso y validación
- Pantalla de verificación de edad antes de entrar al sitio.
- Redirección automática a la tienda si la verificación ya fue aceptada.
- Protección de rutas de administración mediante middleware.
- Login de administrador con autenticación vía Supabase.

### 4.2 Catálogo
- Visualización de productos desde Supabase.
- Búsqueda por nombre.
- Filtros por marca, sabor y tipo.
- Página de detalle por producto.
- Indicador visual de stock disponible y bloqueo para productos agotados.

### 4.3 Carrito
- Agregado de productos desde la tienda y la vista de detalle.
- Ajuste de cantidades.
- Eliminación individual de productos.
- Resumen del total acumulado del carrito.
- Toast de confirmación visual al ejecutar acciones relevantes.

### 4.4 Checkout
- Resumen del pedido antes de confirmar.
- Formulario de datos de envío.
- Generación de mensaje para WhatsApp con el resumen del pedido.
- Limpieza del carrito al confirmar.

### 4.5 Administración
- Pantalla de login para administradores.
- Páginas base para administración de productos y órdenes.
- Integración inicial con Supabase para operaciones administrativas.

## 5. Estado de cumplimiento de requisitos funcionales

### Requisitos funcionales

| Código | Requisito | Estado | Observaciones |
|---|---|---|---|
| RF-01 | Verificación de mayoría de edad | Cumple | Se implementa con pantalla de verificación y middleware que bloquea el acceso hasta validar la edad. |
| RF-03 | Listado de productos disponibles | Parcial | El catálogo carga productos desde Supabase, pero no se filtra aún explícitamente por un campo activo como `active`. |
| RF-04 | Filtro por marca | Cumple | Se implementa con filtros en la vista del catálogo. |
| RF-05 | Filtro por sabor | Cumple | Se implementa con filtros en la vista del catálogo. |
| RF-06 | Filtro por tipo | Cumple | Se implementa con filtros en la vista del catálogo. |
| RF-07 | Búsqueda por nombre | Cumple | Se implementa con un buscador en la parte superior del catálogo. |
| RF-08 | Página de detalle del producto | Cumple | Se muestra la información completa del producto con nombre, imagen, descripción, precio y stock. |
| RF-09 | Indicador de producto agotado | Cumple | El producto agotado se marca visualmente y no permite agregarse al carrito. |
| RF-10 | Agregar producto al carrito | Cumple | Se permite agregar desde la tienda y la vista de detalle. |
| RF-12 | Eliminar producto del carrito | Cumple | Se implementa la eliminación individual de productos. |
| RF-13 | Visualización del total del carrito | Cumple | El carrito muestra el precio total acumulado. |
| RF-15 | Resumen del pedido antes de confirmar | Cumple | El checkout presenta un resumen con productos, cantidades y total. |

## 6. Estado de cumplimiento de requisitos no funcionales

### 6.1 Eficiencia de desempeño

| Código | Requisito | Estado | Observaciones |
|---|---|---|---|
| RNF-01 | Tiempo de carga aceptable | Parcial | La app responde correctamente, pero aún no se ha medido formalmente bajo carga real. |
| RNF-02 | Respuesta del catálogo con filtros | Parcial | El comportamiento es ágil en el entorno actual, aunque no ha sido validado con benchmarks formales. |

### 6.2 Compatibilidad

| Código | Requisito | Estado | Observaciones |
|---|---|---|---|
| RNF-05 | Soporte de navegadores principales | Parcial | La interfaz está construida con tecnologías modernas, pero no se ha validado exhaustivamente en Chrome, Firefox y Edge. |
| RNF-06 | Adaptación a diferentes resoluciones | Cumple | El diseño se adapta mediante un enfoque responsive con Tailwind. |

### 6.3 Usabilidad

| Código | Requisito | Estado | Observaciones |
|---|---|---|---|
| RNF-09 | Mensajes de error comprensibles | Cumple | Los mensajes de error y confirmación están redactados en español para el usuario final. |
| RNF-12 | Confirmación de acciones del usuario | Cumple | Se incorporan toasts y estados visuales de confirmación al agregar o modificar el carrito. |

### 6.4 Fiabilidad

| Código | Requisito | Estado | Observaciones |
|---|---|---|---|
| RNF-14 | Registro íntegro de pedidos | Parcial | El pedido se registra en Supabase a través del checkout, pero depende de la estructura correcta de la tabla `orders`. |
| RNF-15 | Control de integridad del inventario | Parcial | El frontend evita agregar productos sin stock, pero no existe aún una validación server-side robusta del inventario. |

### 6.5 Seguridad

| Código | Requisito | Estado | Observaciones |
|---|---|---|---|
| RNF-17 | Confidencialidad de la información del sistema | Cumple | No se exponen credenciales ni datos sensibles en la interfaz pública. |
| RNF-18 | Autenticación obligatoria para el panel de administración | Cumple | El acceso está protegido por middleware y login con Supabase. |

### 6.6 Mantenibilidad

| Código | Requisito | Estado | Observaciones |
|---|---|---|---|
| RNF-21 | Estructura del proyecto organizada por módulos | Cumple | El proyecto está organizado en carpetas por funcionalidad: app, components, lib, public. |
| RNF-22 | Gestión de versiones con ramas separadas | Parcial | El repositorio muestra uso de ramas de trabajo, aunque la estrategia completa de branching debe mantenerse de forma consistente. |

### 6.7 Portabilidad

| Código | Requisito | Estado | Observaciones |
|---|---|---|---|
| RNF-25 | Código fuente centralizado en un repositorio | Cumple | El proyecto está alojado en un repositorio compartido Git. |
| RNF-28 | El sistema no requiere licencias de software | Cumple | Se utiliza software libre y herramientas de uso abierto o gratuito. |

## 7. Resumen ejecutivo

El proyecto ya cuenta con una base sólida para un marketplace funcional de productos vape. La experiencia de cliente está bien avanzada y se encuentra en un estado operativo para navegación, carrito, checkout y validación de edad. La parte administrativa también está iniciada y protegida, aunque algunas validaciones de negocio y reglas de integridad aún pueden reforzarse.

## 8. Próximos pasos recomendados

- Añadir filtrado de productos por un campo explícito de estado activo.
- Implementar validación de stock y disponibilidad en el backend.
- Mejorar la persistencia y trazabilidad de pedidos en Supabase.
- Medir tiempos de carga y rendimiento reales del sistema.
- Completar el panel administrativo con CRUD de productos y órdenes.
