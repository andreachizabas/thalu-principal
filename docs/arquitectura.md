# Arquitectura inicial

ThaLu se organiza como monorepo con separacion clara entre frontend,
backend e infraestructura.

## Frontend

- Next.js con App Router.
- Componentes de servidor para carga inicial de datos.
- Componentes cliente para carrito, microinteracciones y animaciones.
- Tailwind CSS con tokens de marca: salmon, negro, marfil y rosa profundo.

## Backend

- Go con monolito modular.
- API REST versionada en `/api/v1`.
- Repositorios intercambiables: PostgreSQL para datos reales y memoria solo
  como respaldo de desarrollo cuando no exista `DATABASE_URL`.
- Logs estructurados con `log/slog`.

## Base de datos

PostgreSQL contiene tablas iniciales para catalogo, inventario, pedidos,
pagos, cupones, envios, administradores y mensajes positivos.

Los precios usan centavos COP en enteros para evitar errores de precision.

## Pendientes por fase

- Autenticacion administrativa.
- Checkout con validacion transaccional de inventario.
- Integracion Wompi sandbox y webhooks.
- Panel administrativo completo.
- SEO avanzado, sitemap y datos estructurados de producto.
