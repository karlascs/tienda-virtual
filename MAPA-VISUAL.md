# 🗺️ Mapa Visual del Proyecto IZA&CAS

## 📂 Estructura Completa de Carpetas

```
tienda-next/
│
├── 🐳 DOCKER (Configuración de contenedores)
│   ├── Dockerfile                          # Imagen de Next.js
│   ├── docker-compose.yml                  # Orquestación de servicios
│   ├── .dockerignore                       # Archivos a ignorar en build
│   ├── start-docker.ps1                    # Script Windows
│   └── start-docker.sh                     # Script Linux/Mac
│
├── 🎨 FRONTEND (src/app/ + src/components/)
│   │
│   ├── src/app/                            # 📄 Páginas y rutas
│   │   ├── page.tsx                        # 🏠 Página principal
│   │   ├── layout.tsx                      # Layout global
│   │   ├── globals.css                     # Estilos globales
│   │   │
│   │   ├── products/                       # 📦 Páginas de categorías
│   │   │   ├── tecnologia/page.tsx
│   │   │   ├── electrohogar/page.tsx
│   │   │   ├── herramientas/page.tsx
│   │   │   ├── hogar/page.tsx
│   │   │   ├── actividad/page.tsx
│   │   │   ├── cuidadopersonal/page.tsx
│   │   │   └── juguetes/page.tsx
│   │   │
│   │   ├── admin/                          # 👨‍💼 Panel de administración
│   │   │   ├── page.tsx                   # Dashboard
│   │   │   ├── products/page.tsx          # Gestión productos
│   │   │   ├── categories/page.tsx        # Gestión categorías
│   │   │   ├── banners/page.tsx           # Gestión banners ✨ NUEVO
│   │   │   └── orders/page.tsx            # Gestión órdenes
│   │   │
│   │   └── cart/                          # 🛒 Carrito de compras
│   │       └── page.tsx
│   │
│   ├── src/components/                     # 🧩 Componentes React
│   │   ├── Header.tsx                      # Encabezado
│   │   ├── Footer.tsx                      # Pie de página
│   │   ├── Banner.tsx                      # Carousel de banners ✨ Dinámico
│   │   ├── Categories.tsx                  # Grid de categorías
│   │   ├── ProductCard.tsx                 # Tarjeta de producto
│   │   ├── ProductModal.tsx                # Modal de detalles
│   │   ├── ProductCarousel.tsx             # Carousel de productos
│   │   ├── AdminLayout.tsx                 # Layout del admin ✨ NUEVO
│   │   └── AnimatedSection.tsx             # Animaciones scroll
│   │
│   ├── src/hooks/                          # 🪝 Custom Hooks
│   │   ├── useProducts.ts                  # Hook de productos
│   │   ├── useCarouselKeyboard.ts          # Navegación teclado
│   │   └── useScrollAnimation.ts           # Animaciones
│   │
│   ├── src/context/                        # 🔄 Estado Global
│   │   └── CartContext.tsx                 # Contexto del carrito
│   │
│   └── src/styles/                         # 🎨 CSS Modules
│       ├── header.module.css
│       ├── Footer.module.css
│       ├── Banner.module.css
│       ├── card.module.css
│       └── ...
│
├── 🔧 BACKEND (src/app/api/)
│   │
│   ├── src/app/api/                        # 🚀 API Routes
│   │   │
│   │   ├── products/
│   │   │   ├── route.ts                    # GET /api/products
│   │   │   └── [id]/
│   │   │       └── route.ts                # GET /api/products/:id
│   │   │
│   │   ├── categories/
│   │   │   └── route.ts                    # GET /api/categories
│   │   │
│   │   ├── banners/                        # ✨ NUEVO
│   │   │   └── route.ts                    # GET /api/banners
│   │   │
│   │   └── admin/                          # 👨‍💼 APIs de administración
│   │       │
│   │       ├── stats/
│   │       │   └── route.ts                # GET /api/admin/stats
│   │       │
│   │       ├── products/
│   │       │   ├── route.ts                # POST /api/admin/products
│   │       │   └── [id]/
│   │       │       └── route.ts            # PUT/DELETE
│   │       │
│   │       ├── categories/
│   │       │   ├── route.ts                # GET/POST
│   │       │   └── [id]/
│   │       │       └── route.ts            # PUT/DELETE
│   │       │
│   │       ├── banners/                    # ✨ NUEVO
│   │       │   ├── route.ts                # GET/POST
│   │       │   └── [id]/
│   │       │       └── route.ts            # PUT/DELETE
│   │       │
│   │       └── orders/
│   │           ├── route.ts                # GET
│   │           └── [id]/
│   │               └── route.ts            # PATCH
│   │
│   └── src/lib/
│       └── prisma.ts                       # Cliente Prisma (conexión DB)
│
├── 🗄️ BASE DE DATOS (prisma/)
│   │
│   ├── prisma/schema.prisma                # 📐 Definición de modelos
│   │   ├── Banner          ✨ NUEVO       # Modelo de banners
│   │   ├── Category                        # Modelo de categorías
│   │   ├── Product                         # Modelo de productos
│   │   ├── User                            # Modelo de usuarios
│   │   ├── Order                           # Modelo de órdenes
│   │   ├── OrderItem                       # Items de órdenes
│   │   ├── Cart                            # Carritos
│   │   ├── CartItem                        # Items de carritos
│   │   ├── Review                          # Reseñas
│   │   ├── Wishlist                        # Lista de deseos
│   │   └── WishlistItem                    # Items de wishlist
│   │
│   ├── prisma/migrations/                  # 📜 Historial de cambios
│   │   ├── 20251105171427_init_izacas_ecommerce/
│   │   └── 20251107182434_add_banners_model/  ✨ NUEVO
│   │
│   └── prisma/seeders/                     # 🌱 Datos iniciales
│       ├── seed-real-products.ts           # 9 productos reales
│       ├── seed-banners.ts                 # Banner inicial ✨ NUEVO
│       ├── seed-electrohogar.ts            # Productos electrohogar
│       ├── seed-herramientas.ts            # Productos herramientas
│       ├── seed-tecnologia.ts              # Productos tecnología
│       ├── seed-actividad.ts               # Productos actividad
│       ├── seed-cuidadopersonal.ts         # Productos cuidado personal
│       ├── seed-hogar.ts                   # Productos hogar
│       ├── seed-all-products.ts            # Todos los productos
│       └── fix-image-paths.ts              # Script de corrección
│
├── 🖼️ ARCHIVOS ESTÁTICOS (public/)
│   │
│   ├── public/
│   │   ├── bannerIZAyCAS.png               # Banner principal
│   │   ├── logo_isa&cas.png                # Logo de la tienda
│   │   ├── favicon.ico                     # Icono del sitio
│   │   │
│   │   └── images/                         # 📸 Imágenes de productos
│   │       │
│   │       ├── categorias/                 # Imágenes de categorías
│   │       │   ├── actividad.png
│   │       │   ├── cuidadopersonal.png
│   │       │   ├── herramientas.png
│   │       │   ├── hogar.png
│   │       │   ├── juguetes.png
│   │       │   └── tecnologia.png
│   │       │
│   │       ├── actividad/                  # Productos de actividad
│   │       │   ├── camping/
│   │       │   ├── deporte/
│   │       │   ├── piscina/
│   │       │   └── playa/
│   │       │
│   │       ├── cuidadopersonal/            # Productos cuidado personal
│   │       │   ├── maquinaafeitar/
│   │       │   └── relajación/
│   │       │
│   │       ├── herramientas/               # Productos herramientas
│   │       │   ├── car/
│   │       │   └── iluminacion/
│   │       │
│   │       ├── hogar/                      # Productos del hogar
│   │       │   ├── alfomfrapeluda150/
│   │       │   ├── cocina/
│   │       │   ├── electrodomesticos/
│   │       │   └── ropa de cama/
│   │       │
│   │       ├── juguetes/                   # Juguetes
│   │       │   ├── carpas/
│   │       │   ├── juegos/
│   │       │   └── libreria/
│   │       │
│   │       └── tecnologia/                 # Productos tecnología
│   │           ├── audifonos/
│   │           ├── camaras/
│   │           └── celular/
│   │
│   └── scripts/                            # 🛠️ Scripts de utilidad
│       └── check-images.js
│
├── ⚙️ CONFIGURACIÓN
│   ├── package.json                        # Dependencias y scripts
│   ├── tsconfig.json                       # Configuración TypeScript
│   ├── next.config.ts                      # Configuración Next.js
│   ├── eslint.config.mjs                   # Configuración ESLint
│   ├── postcss.config.mjs                  # Configuración PostCSS
│   ├── prisma.config.ts                    # Configuración Prisma
│   ├── .env                                # Variables de entorno (NO subir a git)
│   ├── .env.example                        # Ejemplo de variables ✨ NUEVO
│   └── .gitignore                          # Archivos ignorados por git
│
└── 📚 DOCUMENTACIÓN
    ├── README.md                           # Documentación principal
    ├── README-DOCKER.md                    # Guía completa de Docker ✨ NUEVO
    ├── RESUMEN-DOCKER.md                   # Resumen ejecutivo ✨ NUEVO
    ├── ARQUITECTURA-DOCKER.md              # Explicación arquitectura ✨ NUEVO
    ├── UBICACION-ARCHIVOS.md               # Este archivo ✨ NUEVO
    ├── BANNERS-ADMIN.md                    # Guía de banners ✨ NUEVO
    └── FASE-6-COMPLETADA.md                # Hitos del proyecto
```

---

## 🎯 Qué va en cada contenedor Docker

### 🐳 **Contenedor 1: `app` (Next.js)**

```
┌────────────────────────────────────────────────────────┐
│                   CONTENEDOR: app                      │
│                     (Puerto 3000)                      │
├────────────────────────────────────────────────────────┤
│                                                        │
│  📁 INCLUYE:                                          │
│                                                        │
│  ✅ Todo src/app/                (páginas + API)     │
│  ✅ Todo src/components/         (componentes React)  │
│  ✅ Todo src/hooks/              (custom hooks)       │
│  ✅ Todo src/context/            (estado global)      │
│  ✅ Todo src/styles/             (CSS)                │
│  ✅ Todo src/lib/                (Prisma client)      │
│  ✅ Todo public/                 (imágenes, logos)    │
│  ✅ Todo prisma/                 (schema, migrations) │
│  ✅ node_modules/                (dependencias)       │
│  ✅ .next/                       (build optimizado)   │
│                                                        │
│  🚀 EJECUTA:                                          │
│     - React (renderizado)                             │
│     - Next.js API Routes                              │
│     - Prisma queries                                  │
│     - Server-side rendering                           │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 🐳 **Contenedor 2: `database` (PostgreSQL)**

```
┌────────────────────────────────────────────────────────┐
│                CONTENEDOR: database                    │
│                    (Puerto 5432)                       │
├────────────────────────────────────────────────────────┤
│                                                        │
│  📁 INCLUYE:                                          │
│                                                        │
│  ✅ PostgreSQL 16                                     │
│  ✅ Tablas de la base de datos:                       │
│     - banners           ✨ NUEVO                      │
│     - categories                                      │
│     - products                                        │
│     - users                                           │
│     - orders                                          │
│     - order_items                                     │
│     - carts                                           │
│     - cart_items                                      │
│     - reviews                                         │
│     - wishlists                                       │
│     - wishlist_items                                  │
│     - sessions                                        │
│     - product_views                                   │
│                                                        │
│  💾 VOLUMEN PERSISTENTE:                              │
│     postgres_data/ (los datos NO se pierden)          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos Completo

```
┌─────────────┐
│   👤 USUARIO │
│  Navegador  │
└──────┬──────┘
       │
       │ HTTP Request
       │ http://localhost:3000
       │
┌──────▼────────────────────────────────────────────────┐
│                                                        │
│  🐳 CONTENEDOR: app (Next.js Full-Stack)             │
│                                                        │
│  ┌────────────────────────────────────────────┐      │
│  │  🎨 FRONTEND (React)                       │      │
│  │  - Lee componentes                         │      │
│  │  - Renderiza HTML                          │      │
│  │  - Ejecuta JavaScript                      │      │
│  └────────────────────────────────────────────┘      │
│                        │                              │
│                        │ Llama API                    │
│                        │                              │
│  ┌────────────────────▼───────────────────────┐      │
│  │  🔧 BACKEND (API Routes)                   │      │
│  │  - Recibe petición HTTP                    │      │
│  │  - Valida datos                            │      │
│  │  - Ejecuta lógica de negocio               │      │
│  └────────────────────┬───────────────────────┘      │
│                        │                              │
│                        │ Query SQL                    │
│                        │                              │
│  ┌────────────────────▼───────────────────────┐      │
│  │  📚 PRISMA CLIENT                          │      │
│  │  - Genera queries SQL                      │      │
│  │  - Valida tipos                            │      │
│  │  - Maneja conexiones                       │      │
│  └────────────────────┬───────────────────────┘      │
│                        │                              │
└────────────────────────┼──────────────────────────────┘
                         │
                         │ TCP/IP (Puerto 5432)
                         │ postgresql://database:5432
                         │
┌────────────────────────▼──────────────────────────────┐
│                                                        │
│  🐳 CONTENEDOR: database (PostgreSQL)                │
│                                                        │
│  ┌────────────────────────────────────────────┐      │
│  │  🗄️ BASE DE DATOS                          │      │
│  │  - Ejecuta query                           │      │
│  │  - Lee/escribe datos                       │      │
│  │  - Retorna resultados                      │      │
│  └────────────────────────────────────────────┘      │
│                                                        │
│  💾 Datos guardados en: postgres_data/                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 📊 Ejemplo Real: Ver la Página Principal

```
1. Usuario abre → http://localhost:3000

2. Next.js renderiza → src/app/page.tsx
   ├── Carga Header.tsx
   ├── Carga Banner.tsx  ✨ (dinámico desde BD)
   ├── Carga Categories.tsx
   └── Carga ProductCarousel.tsx

3. Banner.tsx hace → fetch('/api/banners')

4. API Route ejecuta → src/app/api/banners/route.ts
   └── Código: prisma.banner.findMany({ where: { isActive: true } })

5. Prisma genera SQL → SELECT * FROM banners WHERE isActive = true

6. PostgreSQL retorna → [{ id: '...', title: '...', imageUrl: '...' }]

7. API responde JSON → { success: true, data: [...] }

8. Banner.tsx renderiza → <img src={banner.imageUrl} alt={banner.title} />

9. Usuario ve → Carousel con banners activos
```

---

## 🎯 Comandos según Ubicación

### Desarrollo Local (sin Docker)
```bash
npm run dev                        # Ejecuta Next.js en localhost:3000
npm run db:studio                  # Abre Prisma Studio
npm run db:migrate                 # Ejecuta migraciones
npm run db:seed-real              # Siembra productos
```

### Con Docker
```bash
docker-compose up -d              # Inicia contenedores
docker-compose logs -f app        # Ver logs
docker-compose exec app sh        # Entrar al contenedor
docker-compose exec app npx prisma studio  # Prisma Studio
```

---

✨ **Leyenda:**
- ✨ NUEVO = Agregado recientemente (sistema de banners)
- 🐳 = Relacionado con Docker
- 🎨 = Frontend (visual)
- 🔧 = Backend (lógica)
- 🗄️ = Base de datos
- 📸 = Archivos estáticos

