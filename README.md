# StoreManager — Sistema de Inventario y Ventas

> Proyecto 2 — Bases de Datos 1 (cc3088) | Universidad del Valle de Guatemala | Ciclo 1, 2026

Aplicación web full-stack para gestionar el inventario y las ventas de una tienda. Incluye frontend en React, backend en Node.js/Express y base de datos PostgreSQL, todo orquestado con Docker.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Base de datos | PostgreSQL 15 |
| Backend | Node.js 20 + Express |
| Frontend | React 18 + Vite |
| Infraestructura | Docker + Docker Compose |

---

## Estructura del Proyecto

```
Proyecto-2-Base-de-Datos/
├── docker-compose.yml
├── .env.example
├── .env                        ← (no incluido en el repo)
├── README.md
│
├── database/
│   ├── init.sql                ← DDL: tablas, vistas, índices
│   └── seed.sql                ← Datos de prueba (25+ registros/tabla)
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── db.js
│       ├── routes/
│       │   ├── auth.js
│       │   ├── productos.js
│       │   ├── categorias.js
│       │   ├── proveedores.js
│       │   ├── clientes.js
│       │   ├── empleados.js
│       │   ├── ventas.js
│       │   └── reportes.js
│       └── middleware/
│           └── auth.js
│
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── pages/
            ├── Login.jsx
            ├── Dashboard.jsx
            ├── Productos.jsx
            ├── Categorias.jsx
            ├── Proveedores.jsx
            ├── Clientes.jsx
            ├── Empleados.jsx
            ├── Ventas.jsx
            └── Reportes.jsx
```

---

## Requisitos 

Asegúrate de tener instalados:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (incluye Docker Compose)
- [Git](https://git-scm.com/)

---

## Levantar el Proyecto desde Cero

### 1. Clonar el repositorio

```bash
git clone https://github.com/CasUVG220/Proyecto-2-Base-de-Datos.git
cd Proyecto-2-Base-de-Datos
```

### 2. Crear el archivo de variables de entorno

```bash
cp .env.example .env
```

> El archivo `.env.example` ya contiene los valores correctos para correr el proyecto. No necesitas modificar nada.

### 3. Levantar todos los servicios

```bash
docker compose up
```

> La primera vez puede tardar unos minutos mientras descarga las imágenes y construye los contenedores.

### 4. Acceder a la aplicación

| Servicio | URL |
|---|---|
| Frontend (App web) | http://localhost:5173 |
| Backend (API REST) | http://localhost:3000 |
| PostgreSQL | localhost:5432 |

### 5. Credenciales de acceso

**Base de datos:**
| Campo | Valor |
|---|---|
| Usuario | `proy2` |
| Contraseña | `secret` |
| Base de datos | `storemanager` |

**Aplicación web (usuario de prueba):**
| Campo | Valor |
|---|---|
| Email | `admin@store.com` |
| Contraseña | `admin123` |

---

## Detener el Proyecto

```bash
# Detener los contenedores (mantiene los datos)
docker compose down

# Detener y eliminar todos los datos (reset completo)
docker compose down -v
```

---

## Base de Datos

### Entidades principales

- **categorias** — Agrupación de productos
- **proveedores** — Empresas que surten productos
- **productos** — Inventario de la tienda
- **empleados** — Personal de la tienda
- **clientes** — Compradores registrados
- **ventas** — Registro de cada transacción
- **detalle_ventas** — Líneas de cada venta
- **usuarios** — Cuentas de acceso a la app

### Características del esquema

- Claves primarias, foráneas y restricciones `NOT NULL`
- Normalización hasta 3FN
- Índices explícitos (`CREATE INDEX`) en columnas de búsqueda frecuente
- Vistas (`VIEW`) para reportes complejos
- Transacciones explícitas con `BEGIN / COMMIT / ROLLBACK`

---

## API REST — Endpoints principales

### Autenticación
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión |

### Productos
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/productos` | Listar todos |
| GET | `/api/productos/:id` | Obtener uno |
| POST | `/api/productos` | Crear |
| PUT | `/api/productos/:id` | Actualizar |
| DELETE | `/api/productos/:id` | Eliminar |

### Ventas
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/ventas` | Listar ventas |
| POST | `/api/ventas` | Registrar venta (transacción) |
| GET | `/api/ventas/:id` | Detalle de venta |

### Reportes
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/reportes/ventas-por-empleado` | Ventas agrupadas por empleado |
| GET | `/api/reportes/productos-mas-vendidos` | Top productos (CTE) |
| GET | `/api/reportes/stock-bajo` | Productos con stock crítico |
| GET | `/api/reportes/exportar-csv` | Exportar reporte a CSV |

---

## Funcionalidades Implementadas

### I. Diseño de Base de Datos
- [x] Diagrama ER con entidades, atributos, relaciones y cardinalidades
- [x] Modelo relacional documentado
- [x] Normalización justificada hasta 3FN
- [x] DDL completo con PK, FK y NOT NULL
- [x] Script de datos de prueba (25+ registros por tabla)
- [x] Índices explícitos en columnas justificadas

### II. SQL
- [x] 3 consultas con JOIN entre múltiples tablas (visibles en UI)
- [x] 2 consultas con subquery (IN, EXISTS) visibles en UI
- [x] Consultas con GROUP BY, HAVING y funciones de agregación
- [x] Al menos 1 CTE (WITH) visible en UI
- [x] Al menos 1 VIEW usado por el backend
- [x] Transacción explícita con manejo de error y ROLLBACK

### III. Aplicación Web
- [x] CRUD completo de Productos y Clientes
- [x] Reporte de ventas visible con datos reales
- [x] Manejo visible de errores y validaciones
- [x] README con instrucciones funcionales

### IV. Avanzado
- [x] Autenticación con login/logout y sesión
- [x] Exportar reporte a CSV desde la UI

---

## Variables de Entorno

El archivo `.env.example` contiene:

```env
# Base de datos
POSTGRES_USER=proy2
POSTGRES_PASSWORD=secret
POSTGRES_DB=storemanager
POSTGRES_PORT=5432

# Backend
BACKEND_PORT=3000
JWT_SECRET=supersecretjwtkey2026

# Frontend
VITE_API_URL=http://localhost:3000
```

---

## Notas de Desarrollo

- Todas las queries usan **SQL explícito** — no se usa ningún ORM
- Las transacciones están marcadas con `BEGIN / COMMIT / ROLLBACK`
- Las credenciales de base de datos son exactamente `proy2 / secret` como requiere la rúbrica
- El proyecto levanta completamente con un solo `docker compose up`

---

## 👤 Autor

**CasUVG220**  
Universidad del Valle de Guatemala  
cc3088 — Bases de Datos 1, Ciclo 1 2026