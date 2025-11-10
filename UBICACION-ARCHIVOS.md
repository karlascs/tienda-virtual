# 🏗️ Arquitectura del Proyecto IZA&CAS

## 📁 **¿Dónde está cada parte?**

### 🎨 **FRONTEND** (Interfaz de Usuario)
```
src/
├── app/
│   ├── page.tsx                    # 🏠 Página principal
│   ├── layout.tsx                  # Layout global
│   ├── globals.css                 # Estilos globales
│   ├── products/                   # 📦 Páginas de productos
│   │   ├── tecnologia/
│   │   ├── electrohogar/
│   │   ├── herramientas/
│   │   ├── hogar/
│   │   ├── actividad/
│   │   ├── cuidadopersonal/
│   │   └── juguetes/
│   ├── admin/                      # 👨‍💼 Panel de administración
│   │   ├── page.tsx               # Dashboard
│   │   ├── products/              # Gestión de productos
│   │   ├── categories/            # Gestión de categorías
│   │   ├── banners/               # Gestión de banners
│   │   └── orders/                # Gestión de órdenes
│   └── cart/                      # 🛒 Carrito de compras
│
├── components/                     # 🧩 Componentes React reutilizables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Banner.tsx
│   ├── Categories.tsx
│   ├── ProductCard.tsx
│   ├── ProductModal.tsx
│   ├── AdminLayout.tsx
│   └── ...
│
├── hooks/                          # 🪝 Custom Hooks
│   ├── useProducts.ts
│   ├── useCarouselKeyboard.ts
│   └── useScrollAnimation.ts
│
├── context/                        # 🔄 Context API (Estado global)
│   └── CartContext.tsx
│
├── styles/                         # 🎨 CSS Modules
│   ├── header.module.css
│   ├── Footer.module.css
│   └── ...
│
└── data/                          # 📊 Datos estáticos (legacy)
    └── products.ts
```

### 🔧 **BACKEND** (API y Lógica de Negocio)
```
src/
├── app/api/                       # 🚀 API Routes (Backend)
│   ├── products/
│   │   ├── route.ts              # GET /api/products (listar)
│   │   └── [id]/
│   │       └── route.ts          # GET /api/products/:id (detalle)
│   │
│   ├── categories/
│   │   └── route.ts              # GET /api/categories
│   │
│   ├── banners/
│   │   └── route.ts              # GET /api/banners
│   │
│   └── admin/                    # 👨‍💼 APIs de administración
│       ├── stats/
│       │   └── route.ts          # GET /api/admin/stats
│       ├── products/
│       │   ├── route.ts          # POST /api/admin/products
│       │   └── [id]/
│       │       └── route.ts      # PUT/DELETE /api/admin/products/:id
│       ├── categories/
│       │   ├── route.ts          # GET/POST /api/admin/categories
│       │   └── [id]/
│       │       └── route.ts      # PUT/DELETE /api/admin/categories/:id
│       ├── banners/
│       │   ├── route.ts          # GET/POST /api/admin/banners
│       │   └── [id]/
│       │       └── route.ts      # PUT/DELETE /api/admin/banners/:id
│       └── orders/
│           ├── route.ts          # GET /api/admin/orders
│           └── [id]/
│               └── route.ts      # PATCH /api/admin/orders/:id
│
└── lib/                          # 📚 Configuración y utilidades
    └── prisma.ts                 # Cliente de Prisma (conexión a DB)
```

### 🗄️ **BASE DE DATOS** (PostgreSQL)
```
prisma/
├── schema.prisma                 # 📐 Definición de modelos
│   ├── Banner                   # Modelo de banners
│   ├── Category                 # Modelo de categorías
│   ├── Product                  # Modelo de productos
│   ├── User                     # Modelo de usuarios
│   ├── Order                    # Modelo de órdenes
│   ├── OrderItem                # Items de órdenes
│   ├── Cart                     # Carritos
│   ├── CartItem                 # Items de carritos
│   ├── Review                   # Reseñas
│   ├── Wishlist                 # Listas de deseos
│   └── ...
│
├── migrations/                  # 📜 Historial de cambios de BD
│   ├── 20251105171427_init_izacas_ecommerce/
│   ├── 20251107182434_add_banners_model/
│   └── migration_lock.toml
│
└── seeders/                     # 🌱 Datos iniciales
    ├── seed-real-products.ts   # Seeder de productos reales
    ├── seed-banners.ts         # Seeder de banners
    ├── seed-electrohogar.ts
    ├── seed-herramientas.ts
    ├── seed-tecnologia.ts
    ├── seed-actividad.ts
    ├── seed-cuidadopersonal.ts
    ├── seed-hogar.ts
    └── seed-all-products.ts
```

### 🖼️ **ARCHIVOS ESTÁTICOS** (Imágenes)
```
public/
├── bannerIZAyCAS.png           # Banner principal
├── logo_isa&cas.png            # Logo
├── favicon.ico                 # Icono del sitio
└── images/                     # 📸 Imágenes de productos
    ├── categorias/
    │   ├── actividad.png
    │   ├── cuidadopersonal.png
    │   ├── herramientas.png
    │   ├── hogar.png
    │   ├── juguetes.png
    │   └── tecnologia.png
    │
    └── actividad/
        ├── camping/
        ├── deporte/
        ├── piscina/
        └── playa/
```

---

## 🐳 **Separación en Docker**

### ⚠️ IMPORTANTE: Next.js es Full-Stack

**No se puede separar fácilmente** porque:
- Frontend y Backend están en el **mismo servidor**
- Las API Routes (`/api/*`) son parte de Next.js
- Comparten el mismo código y compilación

### 🎯 Solución: 2 Contenedores

```
┌─────────────────────────────────────────────┐
│                                             │
│           🌐 NAVEGADOR (Cliente)           │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
                   │ HTTP (Puerto 3000)
                   │
┌──────────────────▼──────────────────────────┐
│                                             │
│      🐳 CONTENEDOR: app (Next.js)          │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │  🎨 FRONTEND (React Components)     │  │
│  │  - Páginas (app/*)                  │  │
│  │  - Componentes (components/*)       │  │
│  │  - Estilos (styles/*)               │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │  🔧 BACKEND (API Routes)            │  │
│  │  - /api/products                    │  │
│  │  - /api/categories                  │  │
│  │  - /api/admin/*                     │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │  📚 PRISMA CLIENT                   │  │
│  │  - Conexión a base de datos         │  │
│  │  - Modelos y queries                │  │
│  └─────────────────────────────────────┘  │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
                   │ TCP (Puerto 5432)
                   │
┌──────────────────▼──────────────────────────┐
│                                             │
│    🐳 CONTENEDOR: database (PostgreSQL)    │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │  🗄️ BASE DE DATOS                   │  │
│  │  - Tablas (banners, products, etc.) │  │
│  │  - Datos persistentes               │  │
│  │  - Índices y relaciones             │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  📦 Volumen: postgres_data (persistente)  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📊 Flujo de Datos

### 1️⃣ Usuario visita la página principal

```
Usuario → http://localhost:3000
    ↓
Next.js (app/page.tsx)
    ↓
Banner.tsx consume → GET /api/banners
    ↓
API Route (app/api/banners/route.ts)
    ↓
Prisma Client → SELECT * FROM banners
    ↓
PostgreSQL (contenedor database)
    ↓
Respuesta JSON con banners
    ↓
React renderiza el carousel
```

### 2️⃣ Admin crea un nuevo banner

```
Admin → http://localhost:3000/admin/banners
    ↓
Click "Nuevo Banner" → Formulario
    ↓
Submit → POST /api/admin/banners
    ↓
API Route (app/api/admin/banners/route.ts)
    ↓
Prisma Client → INSERT INTO banners
    ↓
PostgreSQL guarda el registro
    ↓
Respuesta exitosa
    ↓
Lista de banners se actualiza
```

---

## 🔗 Conexiones entre Servicios

### En Desarrollo (Local)
```
Next.js → localhost:5432 → PostgreSQL Local
```

### En Docker
```
Contenedor app → database:5432 → Contenedor database
```

**Importante:** Dentro de Docker, los contenedores se comunican por nombre:
- ✅ `database` (nombre del servicio)
- ❌ `localhost` (no funciona entre contenedores)

---

## 🚀 Comandos para Levantar Todo

### Opción 1: Todo en Docker (Recomendado para producción)
```bash
docker-compose up -d
```

### Opción 2: Solo BD en Docker (Mejor para desarrollo)
```bash
# Levantar solo PostgreSQL
docker-compose up database -d

# Ejecutar Next.js localmente (más rápido con hot reload)
npm run dev
```

---

## 📝 Resumen Ejecutivo

| Componente | Ubicación | Puerto | Contenedor |
|------------|-----------|--------|------------|
| **Frontend** | `src/app/*`, `src/components/*` | 3000 | `app` |
| **Backend API** | `src/app/api/*` | 3000 | `app` |
| **Base de Datos** | PostgreSQL | 5432 | `database` |
| **Imágenes** | `public/images/*` | - | - |
| **Prisma** | `prisma/*` | - | `app` |

**Todo el código de Next.js (frontend + backend) está en el mismo contenedor** porque Next.js es un framework full-stack integrado.

---

¿Necesitas separar completamente frontend y backend? Tendrías que:
1. Migrar el backend a un servidor independiente (Express, NestJS, etc.)
2. Convertir Next.js en SPA pura (sin API Routes)
3. Configurar CORS entre ambos

**Recomendación:** Mantén la arquitectura actual (Next.js full-stack) ya que es más eficiente y fácil de mantener 👍
