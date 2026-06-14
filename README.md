# Control de Suscripciones

## Estructura del monorepo

```
control-suscripciones/
├── frontend/          # React + TypeScript + Vite + React Router
├── backend/           # Node.js + Express + TypeScript + MySQL
├── package.json       # Scripts raíz con concurrently
└── README.md
```

## Requisitos previos

- Node.js 18+
- MySQL 8+ en ejecución

## Configuración de la base de datos

### Opción recomendada: script completo

### Configurar conexión del backend


```bash
copy backend\.env.example backend\.env
```

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=db_equipo_15
```

### Probar la conexión

```bash
npm run db:test --workspace=backend
```

## Instalación y ejecución

Desde la raíz del proyecto (instala dependencias de raíz, backend y frontend con npm workspaces):

```bash
npm install
npm run dev
```

Esto inicia:

- **Backend** en `http://localhost:3001`
- **Frontend** en `http://localhost:5173`

## API REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/dashboard/resumen` | Resumen del dashboard |
| GET | `/api/dashboard/proximos-cobros` | Próximos cobros |
| GET | `/api/categorias` | Listar categorías |
| GET | `/api/servicios` | Listar servicios (filtros: `busqueda`, `categoria_id`) |
| GET | `/api/servicios/:id` | Obtener servicio |
| GET | `/api/suscripciones` | Listar suscripciones |
| GET | `/api/suscripciones/:id` | Obtener suscripción |
| POST | `/api/suscripciones` | Crear suscripción |
| PUT | `/api/suscripciones/:id` | Actualizar suscripción |
| DELETE | `/api/suscripciones/:id` | Eliminar suscripción |
| PATCH | `/api/suscripciones/:id/activar` | Activar suscripción |
| PATCH | `/api/suscripciones/:id/desactivar` | Desactivar suscripción |

## Recordatorios

Los recordatorios se calculan dinámicamente con `fecha_proximo_cobro`:

- **Rojo**: cobro hoy o vencido
- **Amarillo**: cobro dentro de 7 días
- **Verde**: más de 7 días

## Tecnologías

**Frontend:** React, TypeScript, Vite, React Router, CSS tradicional

**Backend:** Node.js, Express, TypeScript (CommonJS), mysql2/promise, dotenv, cors, ts-node-dev

**Raíz:** concurrently
