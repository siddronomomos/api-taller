# API Taller Mecánico

API REST en Node.js + TypeScript que expone las operaciones necesarias para reemplazar la capa de base de datos usada por la aplicación de escritorio del taller mecánico. Implementa autenticación básica, gestión de usuarios, clientes, vehículos, piezas, reparaciones y detalles con validaciones, transacciones y control de inventario.

## Requisitos

- Node.js >= 18
- MySQL 8 (o versión compatible con mysql2)
- Un archivo `.env` basado en [`./.env.example`](./.env.example)

## Instalación

```bash
npm install
```

## Variables de entorno

| Variable     | Descripción                        | Ejemplo            |
|--------------|------------------------------------|--------------------|
| `PORT`       | Puerto HTTP donde escuchar         | `4000`             |
| `DB_HOST`    | Host del servidor MySQL            | `localhost`        |
| `DB_USER`    | Usuario con acceso a la base       | `taller_user`      |
| `DB_PASSWORD`| Contraseña del usuario             | `súper-segura`     |
| `DB_NAME`    | Base de datos del proyecto         | `taller_mecanico`  |

## Comandos disponibles

| Comando          | Descripción                                  |
|------------------|----------------------------------------------|
| `npm run dev`    | Levanta el servidor en modo desarrollo (hot reload). |
| `npm run build`  | Compila TypeScript a JavaScript en `dist/`.  |
| `npm start`      | Ejecuta la versión compilada.                |

## Endpoints principales

Todos los endpoints están colgados bajo `/api`.

### Autenticación

- `POST /api/auth/login` – retorna el usuario autenticado si las credenciales son válidas.

### Usuarios

- `GET /api/users` – lista usuarios.
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Clientes

- `GET /api/clientes`
- `GET /api/clientes/:id`
- `POST /api/clientes`
- `PUT /api/clientes/:id`
- `DELETE /api/clientes/:id`

### Vehículos

- `GET /api/vehiculos`
- `GET /api/vehiculos/cliente/:clienteId`
- `GET /api/vehiculos/:matricula`
- `POST /api/vehiculos`
- `PUT /api/vehiculos/:matricula`
- `DELETE /api/vehiculos/:matricula`

### Piezas

- `GET /api/piezas`
- `GET /api/piezas/:id`
- `POST /api/piezas`
- `PUT /api/piezas/:id`
- `PATCH /api/piezas/:id/stock` (campo `delta` en el cuerpo)
- `DELETE /api/piezas/:id`

### Reparaciones

- `GET /api/reparaciones`
- `GET /api/reparaciones/vehiculo/:matricula`
- `GET /api/reparaciones/:folio`
- `POST /api/reparaciones`
- `PUT /api/reparaciones/:folio`
- `DELETE /api/reparaciones/:folio`

### Detalles de reparación

- `GET /api/detalles/folio/:folio`
- `POST /api/detalles`
- `DELETE /api/detalles/:id`

## Desarrollo

1. Crea un `.env` desde el ejemplo y actualiza las credenciales.
2. Ejecuta `npm run dev` para iniciar el servidor en `http://localhost:4000`.
3. Usa herramientas como Postman/Insomnia o la propia aplicación de escritorio para consumir los endpoints.

## Notas técnicas

- El pool de MySQL usa transacciones (`withTransaction`) para operaciones críticas (p.ej. alta/baja de detalles, eliminación de reparaciones).
- Las validaciones se manejan con Zod en la capa de servicios; los controladores solo delegan y retornan códigos HTTP consistentes.
- Los errores se normalizan mediante `HttpError` y el `errorHandler` global.
