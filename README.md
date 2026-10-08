# ThaLu By Andrea Chizabas

Tienda virtual colombiana de belleza, maquillaje, skincare y cuidado capilar.

## Estado del proyecto

Fase 1 en desarrollo local:

- Frontend: React, Next.js, TypeScript y Tailwind CSS.
- Backend: Go y API REST.
- Base de datos: PostgreSQL.
- Infraestructura: Docker Compose.

## Estructura

- `frontend/`: experiencia web y carrito inicial.
- `backend/`: API REST Go.
- `backend/migrations/`: esquema PostgreSQL inicial.
- `.github/workflows/`: validaciones de CI.
- `docs/`: documentacion tecnica.

## Desarrollo local

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
go test ./...
go run ./cmd/api
```

Docker Compose:

```bash
docker compose up --build
```

Docker no esta instalado en el entorno actual de trabajo, por lo que la
configuracion queda preparada pero pendiente de prueba local con Docker.
