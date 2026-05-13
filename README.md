# Bolsa de Empleo

Aplicación integrada con:

- **Frontend**: React + Vite + `fetch`
- **Backend**: Spring Boot + REST + Java
- **Base de datos**: MySQL
- **Seguridad**: JWT basado en roles
- **Producción**: un solo servidor Spring Boot sirve la API y la SPA compilada

## Estructura

- `frontend/`: interfaz React
- `backend/`: API REST y lógica de negocio

## Desarrollo

### 1) Backend

```powershell
Set-Location "C:\Users\tatan\OneDrive\Documentos\Sebastian\2026\Progra IV\Proyecto II\Bolsa-Empleo\backend"
.\mvnw.cmd spring-boot:run
```

### 2) Frontend

```powershell
Set-Location "C:\Users\tatan\OneDrive\Documentos\Sebastian\2026\Progra IV\Proyecto II\Bolsa-Empleo\frontend"
npm install
npm run dev
```

El frontend usa proxy hacia `http://localhost:8080/api`.

## Producción

### 1) Construir la SPA

```powershell
Set-Location "C:\Users\tatan\OneDrive\Documentos\Sebastian\2026\Progra IV\Proyecto II\Bolsa-Empleo\frontend"
npm run build
```

Eso deja el build dentro de:

`backend/src/main/resources/static/app`

### 2) Empaquetar el backend

```powershell
Set-Location "C:\Users\tatan\OneDrive\Documentos\Sebastian\2026\Progra IV\Proyecto II\Bolsa-Empleo\backend"
.\mvnw.cmd -DskipTests package
```

### 3) Abrir la SPA

- React: `http://localhost:8080/app`
- API auth: `POST /api/auth/login`
- API pública: `GET /api/public/puestos-recientes`
- Usuario actual: `GET /api/auth/me`

## Pantallas migradas a React

- `Inicio`: muestra puestos recientes.
- `Buscar puestos`: filtra por árbol de características con llamadas asíncronas.
- `Login`: autentica con JWT.
- `Dashboard`: renderiza una vista distinta según el rol (`ADMIN`, `EMPRESA`, `OFERENTE`).

## Endpoints principales usados por React

- `GET /api/public/puestos-recientes`
- `GET /api/public/buscar`
- `GET /api/public/caracteristicas-arbol`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard`

## Notas

- El backend mantiene el MVC legado en `/presentation/**`.
- La SPA React se sirve como cliente principal en `/app`.
- Los endpoints `/api/**` usan JWT y validan roles.

