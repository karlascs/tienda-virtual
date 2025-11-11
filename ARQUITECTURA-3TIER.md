# 🏗️ Arquitectura de 3 Capas - IZA&CAS E-commerce

## 📋 Descripción

Este proyecto implementa una arquitectura de 3 capas completamente separadas según los requisitos de evaluación:

```
┌──────────────────────────────────────────────────────┐
│           CAPA 1: BASE DE DATOS                      │
│  PostgreSQL 16 - Database: "iza&cas"                │
│  Puerto: 5434 (externo)                             │
│  Gestión: pgAdmin + Prisma Studio                   │
└──────────────────────────────────────────────────────┘
                      ↑
                      │
┌──────────────────────────────────────────────────────┐
│           CAPA 2: BACKEND API                        │
│  Next.js 15 API Routes                              │
│  Puerto: 3001                                        │
│  Tecnologías: Prisma ORM, NextAuth, Transbank       │
└──────────────────────────────────────────────────────┘
                      ↑
                      │
┌──────────────────────────────────────────────────────┐
│           CAPA 3: FRONTEND                           │
│  Next.js 15 React Client                            │
│  Puerto: 3000                                        │
│  Tecnologías: React 19, TailwindCSS                 │
└──────────────────────────────────────────────────────┘
```

---

## 🚀 Levantar la Arquitectura

### Requisitos Previos
- Docker Desktop instalado y corriendo
- Puerto 3000 (frontend) disponible
- Puerto 3001 (backend) disponible
- Puerto 5434 (database) disponible
- Puerto 5050 (pgAdmin) disponible

### Comandos

```powershell
# 1. Levantar todos los servicios
docker-compose -f docker-compose.3tier.yml up -d

# 2. Verificar que están corriendo
docker-compose -f docker-compose.3tier.yml ps

# 3. Ver logs
docker-compose -f docker-compose.3tier.yml logs -f

# 4. Detener servicios
docker-compose -f docker-compose.3tier.yml down
```

---

## 🔍 CAPA 1: Base de Datos

### Características
- **Nombre:** `iza&cas` (con carácter especial &)
- **Engine:** PostgreSQL 16 Alpine
- **Usuario:** postgres
- **Contraseña:** admin123
- **Puerto Externo:** 5434
- **Puerto Interno:** 5432

### Acceso via pgAdmin

1. **Abrir pgAdmin:**
   ```
   http://localhost:5050
   ```

2. **Credenciales de pgAdmin:**
   - Email: `admin@izacas.com`
   - Contraseña: `admin123`

3. **Agregar Servidor PostgreSQL:**
   - Nombre: `IZA&CAS Database`
   - Host: `database` (desde dentro de Docker) o `localhost` (externo)
   - Puerto: `5432` (interno) o `5434` (externo)
   - Database: `iza&cas`
   - Usuario: `postgres`
   - Contraseña: `admin123`

### Acceso via Prisma Studio

```powershell
# Abrir Prisma Studio desde el backend
docker-compose -f docker-compose.3tier.yml exec backend npx prisma studio
```

Abrir en navegador: `http://localhost:5555`

### Verificar Datos

```powershell
# Copiar script de verificación
docker cp check-db.js izacas-backend:/app/check-db.js

# Ejecutar verificación
docker-compose -f docker-compose.3tier.yml exec backend node check-db.js
```

### Ejecutar Migraciones

```powershell
docker-compose -f docker-compose.3tier.yml exec backend npx prisma migrate deploy
```

### Cargar Datos Iniciales

```powershell
# Copiar seeder
docker cp seed-docker.js izacas-backend:/app/seed-docker.js

# Ejecutar seeder
docker-compose -f docker-compose.3tier.yml exec backend node seed-docker.js
```

---

## 🔧 CAPA 2: Backend API

### Características
- **Framework:** Next.js 15.5.2 con App Router
- **Puerto:** 3001
- **ORM:** Prisma Client 6.19.0
- **Auth:** NextAuth.js v5
- **Pagos:** Transbank Webpay Plus
- **Envíos:** Chilexpress API

### Endpoints Disponibles

```
http://localhost:3001/api/
├─ auth/
│  ├─ login          (POST) - Autenticación
│  ├─ register       (POST) - Registro
│  └─ session        (GET)  - Verificar sesión
├─ products/
│  ├─ [GET]          Lista paginada
│  └─ [id]/[GET]     Detalle de producto
├─ categories/[GET]  Lista de categorías
├─ orders/
│  ├─ [POST]         Crear orden
│  └─ [id]/[GET]     Detalle de orden
├─ admin/
│  ├─ products       CRUD productos
│  ├─ categories     CRUD categorías
│  ├─ orders         Gestión órdenes
│  ├─ sales          Sistema de ventas
│  └─ stats          Estadísticas
└─ webhooks/
   └─ transbank      Confirmación de pago
```

### Testing del Backend

```powershell
# Ver logs del backend
docker-compose -f docker-compose.3tier.yml logs backend -f

# Ejecutar comando dentro del backend
docker-compose -f docker-compose.3tier.yml exec backend sh

# Test de API desde PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/products" -Method GET
```

### Variables de Entorno del Backend

```env
# Base de datos
DATABASE_URL=postgresql://postgres:admin123@database:5432/iza&cas

# NextAuth
NEXTAUTH_SECRET=izacas-secret-key-production-2024
NEXTAUTH_URL=http://localhost:3001

# Transbank
TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
TRANSBANK_ENVIRONMENT=integration

# Store
NEXT_PUBLIC_STORE_NAME=IZA&CAS
NEXT_PUBLIC_STORE_URL=http://localhost:3000
```

---

## 🎨 CAPA 3: Frontend

### Características
- **Framework:** Next.js 15.5.2 Client Components
- **Puerto:** 3000
- **UI:** React 19, TailwindCSS 3.4
- **Estado:** Context API + React Hooks

### Páginas Disponibles

```
http://localhost:3000/
├─ /                    Página principal
├─ /products            Catálogo
├─ /products/[slug]     Detalle producto
├─ /cart                Carrito de compras
├─ /login               Iniciar sesión
├─ /register            Registro
├─ /wishlist            Lista de deseos
└─ /admin/              Panel administrativo
   ├─ dashboard         Dashboard
   ├─ products          Gestión productos
   ├─ categories        Gestión categorías
   ├─ orders            Gestión órdenes
   └─ sales             Sistema de ventas
```

### Testing del Frontend

```powershell
# Ver logs del frontend
docker-compose -f docker-compose.3tier.yml logs frontend -f

# Abrir en navegador
start http://localhost:3000
```

### Variables de Entorno del Frontend

```env
# Conexión al Backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# NextAuth (heredado del backend)
NEXTAUTH_SECRET=izacas-secret-key-production-2024
NEXTAUTH_URL=http://localhost:3000

# Store Info
NEXT_PUBLIC_STORE_NAME=IZA&CAS
NEXT_PUBLIC_STORE_URL=http://localhost:3000
```

---

## 🔒 Administración de la Base de Datos

### 1. pgAdmin (Interfaz Física - Requerido)

**Acceso:**
```
URL: http://localhost:5050
Email: admin@izacas.com
Password: admin123
```

**Conectar al Servidor:**
1. Click derecho en "Servers" → Create → Server
2. **General Tab:**
   - Name: `IZA&CAS Production`
3. **Connection Tab:**
   - Host: `localhost` (si accedes desde tu PC)
   - Host: `database` (si accedes desde Docker)
   - Port: `5434` (externo) o `5432` (interno)
   - Database: `iza&cas`
   - Username: `postgres`
   - Password: `admin123`

**Operaciones Disponibles:**
- ✅ Ver todas las tablas
- ✅ Crear/modificar/eliminar registros
- ✅ Ejecutar queries SQL
- ✅ Importar/exportar datos
- ✅ Ver estructura del schema

### 2. Prisma Studio (Interfaz Web - Requerido)

**Levantar Prisma Studio:**
```powershell
docker-compose -f docker-compose.3tier.yml exec backend npx prisma studio
```

**Acceso:**
```
URL: http://localhost:5555
```

**Operaciones Disponibles:**
- ✅ CRUD visual de todas las tablas
- ✅ Filtros avanzados
- ✅ Relaciones entre tablas
- ✅ Edición en línea
- ✅ Exportar datos

**Ejemplo de Uso:**
1. Click en tabla "Product"
2. Ver todos los productos
3. Click en un producto para editar
4. Guardar cambios
5. Los cambios se reflejan inmediatamente en pgAdmin

---

## 📊 Demostración de Separación de Capas

### Prueba 1: Detener Frontend

```powershell
# Detener solo el frontend
docker stop izacas-frontend

# Backend sigue funcionando
Invoke-RestMethod -Uri "http://localhost:3001/api/products" -Method GET

# Frontend no responde
start http://localhost:3000  # Error de conexión
```

### Prueba 2: Detener Backend

```powershell
# Detener solo el backend
docker stop izacas-backend

# Base de datos sigue accesible
start http://localhost:5050  # pgAdmin funciona

# Backend no responde
Invoke-RestMethod -Uri "http://localhost:3001/api/products" -Method GET  # Error
```

### Prueba 3: Detener Base de Datos

```powershell
# Detener solo la base de datos
docker stop izacas-database

# Backend falla al conectar
Invoke-RestMethod -Uri "http://localhost:3001/api/products" -Method GET  # Error DB

# Frontend carga pero no obtiene datos
start http://localhost:3000  # Página vacía
```

### Prueba 4: Levantar Capas Independientemente

```powershell
# Levantar solo base de datos
docker start izacas-database
# pgAdmin conecta ✅

# Levantar backend
docker start izacas-backend
# API responde ✅

# Levantar frontend
docker start izacas-frontend
# Aplicación completa funciona ✅
```

---

## 🗂️ Estructura de Archivos

```
tienda-next/
├─ docker-compose.3tier.yml    # Orquestación 3 capas
├─ Dockerfile.backend           # Imagen del Backend
├─ Dockerfile.frontend          # Imagen del Frontend
├─ init-db.sql                  # Inicialización DB
├─ check-db.js                  # Script verificación
├─ seed-docker.js               # Seeder de datos
├─ prisma/
│  ├─ schema.prisma            # Schema de BD
│  └─ migrations/              # Migraciones
├─ src/
│  ├─ app/                     # Frontend + Backend
│  │  ├─ api/                 # 🔧 BACKEND (puerto 3001)
│  │  ├─ (pages)/             # 🎨 FRONTEND (puerto 3000)
│  │  └─ layout.tsx
│  ├─ components/              # 🎨 FRONTEND
│  ├─ context/                 # 🎨 FRONTEND
│  └─ lib/
│     └─ prisma.ts            # 🔧 BACKEND
└─ public/                     # 🎨 FRONTEND
```

---

## 🛠️ Comandos Útiles

### Gestión de Contenedores

```powershell
# Ver estado
docker-compose -f docker-compose.3tier.yml ps

# Ver logs de todos
docker-compose -f docker-compose.3tier.yml logs -f

# Ver logs de uno específico
docker-compose -f docker-compose.3tier.yml logs backend -f
docker-compose -f docker-compose.3tier.yml logs frontend -f
docker-compose -f docker-compose.3tier.yml logs database -f

# Reiniciar un servicio
docker-compose -f docker-compose.3tier.yml restart backend

# Reconstruir imágenes
docker-compose -f docker-compose.3tier.yml up --build -d

# Limpiar todo
docker-compose -f docker-compose.3tier.yml down -v
```

### Base de Datos

```powershell
# Conectar a PostgreSQL
docker-compose -f docker-compose.3tier.yml exec database psql -U postgres -d "iza&cas"

# Backup de la base de datos
docker-compose -f docker-compose.3tier.yml exec database pg_dump -U postgres "iza&cas" > backup.sql

# Restaurar base de datos
docker-compose -f docker-compose.3tier.yml exec -T database psql -U postgres "iza&cas" < backup.sql

# Ver tablas
docker-compose -f docker-compose.3tier.yml exec database psql -U postgres -d "iza&cas" -c "\dt"
```

### Debugging

```powershell
# Entrar al contenedor backend
docker-compose -f docker-compose.3tier.yml exec backend sh

# Entrar al contenedor frontend
docker-compose -f docker-compose.3tier.yml exec frontend sh

# Inspeccionar red
docker network inspect tienda-next_izacas-network

# Ver consumo de recursos
docker stats
```

---

## ✅ Checklist de Evaluación

### Requisitos Cumplidos

- [x] **Arquitectura de 3 Capas Separadas**
  - [x] Base de Datos en contenedor independiente
  - [x] Backend API en contenedor independiente
  - [x] Frontend en contenedor independiente

- [x] **Base de Datos "iza&cas"**
  - [x] Nombre exacto con carácter especial (&)
  - [x] Accesible via pgAdmin (puerto 5050)
  - [x] Accesible via Prisma Studio (puerto 5555)
  - [x] Persistencia de datos con volumes

- [x] **Separación Funcional**
  - [x] Cada capa puede detenerse independientemente
  - [x] Backend funciona sin Frontend
  - [x] Base de datos accesible sin Backend
  - [x] Frontend hace requests al Backend API

- [x] **Gestión Dual de Base de Datos**
  - [x] pgAdmin (interfaz física/web)
  - [x] Prisma Studio (interfaz web)
  - [x] Ambos pueden crear/modificar/eliminar registros

- [x] **Docker Compose**
  - [x] Orquestación de 4 servicios
  - [x] Red bridge compartida
  - [x] Healthchecks
  - [x] Variables de entorno

---

## 📸 Evidencias Visuales

### Arquitectura en Funcionamiento

```powershell
PS> docker-compose -f docker-compose.3tier.yml ps
NAME              STATUS                    PORTS
izacas-backend    Up 5 minutes              0.0.0.0:3001->3001/tcp
izacas-database   Up 5 minutes (healthy)    0.0.0.0:5434->5432/tcp
izacas-frontend   Up 5 minutes              0.0.0.0:3000->3000/tcp
izacas-pgadmin    Up 5 minutes              0.0.0.0:5050->80/tcp
```

### Verificación de Datos

```powershell
PS> docker-compose -f docker-compose.3tier.yml exec backend node check-db.js
📊 Estado de la base de datos "iza&cas":
  ├─ Categorías: 7
  └─ Productos: 10

🛍️ Primeros 5 productos:
  1. Carpa Casita de Princesa - $25990
  2. Carpa de Castillo Infantil - $27990
  3. Carpa Túnel - $22990
  4. Balón de Fútbol Air Power - $15990
  5. Proyector Astronauta Infantil - $35990
```

---

## 🎓 Conclusión

Esta implementación demuestra una **arquitectura de 3 capas completamente separadas** donde:

1. **Base de Datos** (PostgreSQL) gestiona la persistencia
2. **Backend API** (Next.js API Routes) procesa lógica de negocio
3. **Frontend** (Next.js Client) presenta la interfaz de usuario

Cada capa puede:
- ✅ Ejecutarse independientemente
- ✅ Detenerse sin afectar a las demás
- ✅ Escalarse horizontalmente
- ✅ Desplegarse en servidores diferentes

La base de datos "iza&cas" es accesible mediante:
- 🔧 pgAdmin (interfaz física/web profesional)
- 🎨 Prisma Studio (interfaz web moderna)

Ambas herramientas permiten visualización, creación, modificación y eliminación de datos en tiempo real.

---

**Desarrollado por:** Karla  
**Fecha:** Enero 2025  
**Evaluación:** Arquitectura de Software - 3 Capas
