# StoreManager — Sistema de Inventario y Ventas

> Proyecto 2 — Bases de Datos 1 (cc3088) | Universidad del Valle de Guatemala | Ciclo 1, 2026

Aplicación web full-stack para gestionar el inventario y las ventas de una tienda. Incluye frontend en React, backend en Node.js/Express y base de datos PostgreSQL, todo orquestado con Docker.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Base de datos | PostgreSQL 15 |
| Backend | Node.js 20 + Express |
| Frontend | React 18 + Vite + Tailwind CSS |
| Infraestructura | Docker + Docker Compose |

---

## Requisitos Previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

> No necesitas instalar Node.js ni PostgreSQL localmente. Docker se encarga de todo.

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

### 3. Levantar todos los servicios

```bash
docker compose up --build
```

> La primera vez tarda 2-3 minutos mientras construye las imágenes.

### 4. Acceder a la aplicación

| Servicio | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| PostgreSQL | localhost:5432 |

### 5. Credenciales

**Base de datos:**
| Campo | Valor |
|---|---|
| Usuario | `proy2` |
| Contraseña | `secret` |
| Base de datos | `storemanager` |

**Aplicación web:**
| Campo | Valor |
|---|---|
| Email | `admin@store.com` |
| Contraseña | `admin123` |

---

## Detener el Proyecto

```bash
# Detener manteniendo los datos
docker compose down

# Reset completo (borra todos los datos)
docker compose down -v 
```

---

## Estructura del Proyecto