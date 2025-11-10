# 🐳 Arquitectura Docker - IZA&CAS E-commerce

## 📁 Estructura Actual del Proyecto

Tu proyecto **Next.js** es una aplicación **Full-Stack** que combina:

```
tienda-next/
├── src/
│   ├── app/                    # 🎨 FRONTEND (Pages, Layouts)
│   │   ├── page.tsx           # Página principal
│   │   ├── products/          # Páginas de productos
│   │   ├── admin/             # Panel de administración
│   │   └── api/               # 🔧 BACKEND (API Routes)
│   │       ├── products/
│   │       ├── categories/
│   │       ├── banners/
│   │       └── admin/
│   ├── components/            # 🎨 FRONTEND (Componentes React)
│   ├── hooks/                 # 🎨 FRONTEND
│   └── lib/                   # 🔧 BACKEND (Configuración Prisma)
│
├── prisma/                    # 🗄️ BASE DE DATOS
│   ├── schema.prisma         # Definición de modelos
│   ├── migrations/           # Historial de cambios
│   └── seeders/              # Datos iniciales
│
└── public/                   # 🖼️ FRONTEND (Imágenes estáticas)
```

## 🏗️ Separación en 3 Contenedores Docker

### 1️⃣ **Base de Datos** (PostgreSQL)
- **Contenedor**: `postgres:16`
- **Puerto**: 5432
- **Datos**: Volumen persistente

### 2️⃣ **Backend** (Next.js API)
- **Contenedor**: Node.js
- **Incluye**: 
  - `/src/app/api/*` (todas las rutas API)
  - `/src/lib/*` (configuración Prisma)
  - `/prisma/*` (schema y migraciones)
- **Puerto**: 3001

### 3️⃣ **Frontend** (Next.js Client)
- **Contenedor**: Node.js
- **Incluye**:
  - `/src/app/*` (páginas)
  - `/src/components/*` (componentes React)
  - `/public/*` (imágenes)
- **Puerto**: 3000

## ⚠️ IMPORTANTE: Next.js es Full-Stack

Next.js **NO se separa fácilmente** en frontend/backend porque:
- Las rutas API (`/api/*`) están en el mismo servidor
- Ambos comparten el mismo código y configuración
- La compilación es única

### 🎯 Solución Recomendada: 2 Contenedores

**Es más práctico usar 2 contenedores:**

1. **PostgreSQL** (Base de datos)
2. **Next.js Full-Stack** (Frontend + Backend juntos)

Esto es lo estándar en Next.js y es más eficiente.

## 📦 Archivos Docker Generados

He creado los siguientes archivos:

1. `Dockerfile` - Contenedor de Next.js
2. `docker-compose.yml` - Orquestación de servicios
3. `.dockerignore` - Archivos a ignorar
4. `README-DOCKER.md` - Guía completa de uso

## 🚀 Comandos Rápidos

### Iniciar todo:
```bash
docker-compose up -d
```

### Ver logs:
```bash
docker-compose logs -f
```

### Detener todo:
```bash
docker-compose down
```

### Reconstruir:
```bash
docker-compose up --build -d
```

---

**¿Aún quieres separar frontend/backend?** Sería necesario:
- Migrar el backend a una API REST independiente (Express, Fastify, etc.)
- Convertir Next.js en una SPA pura (sin API Routes)
- Más complejo de mantener

**Recomendación:** Usa la configuración de 2 contenedores (DB + Next.js Full-Stack) 👍
