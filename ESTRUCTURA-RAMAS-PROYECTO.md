# 🌿 Estructura de Ramas - Tienda Virtual

Estrategia de ramas para el repositorio: https://github.com/karlascs/tienda-virtual.git

## 📋 Estructura de Ramas

### 🌳 Rama Principal

#### `master` o `main`
- **Contenido**: Proyecto completo integrado y sanitizado
- **Deploy**: Conectado a Vercel
- **Estado**: Producción
- **Propósito**: Código estable y deployable

---

## 🎯 Ramas por Componente del Sistema

### 🎨 `frontend`
**Todo el código del lado del cliente**

```
Incluye:
├── src/
│   ├── app/                    # App Router Next.js
│   │   ├── page.tsx           # Homepage
│   │   ├── layout.tsx         # Layout principal
│   │   ├── globals.css        # Estilos globales
│   │   ├── cart/              # Carrito de compras
│   │   ├── checkout/          # Proceso de pago
│   │   ├── products/          # Categorías de productos
│   │   ├── profile/           # Perfil de usuario
│   │   ├── login/             # Autenticación
│   │   └── register/          # Registro
│   ├── components/            # Componentes React
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductModal.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── Categories.tsx
│   │   ├── Banner.tsx
│   │   ├── ShippingOptions.tsx
│   │   └── GuestCheckoutForm.tsx
│   ├── context/               # React Context APIs
│   │   ├── CartContext.tsx
│   │   ├── WishlistContext.tsx
│   │   ├── SearchContext.tsx
│   │   └── FilterContext.tsx
│   ├── hooks/                 # Custom hooks
│   │   ├── useScrollAnimation.ts
│   │   └── useCarouselKeyboard.ts
│   ├── styles/                # CSS Modules
│   │   ├── header.module.css
│   │   ├── Footer.module.css
│   │   ├── card.module.css
│   │   └── ...
│   └── utils/                 # Utilidades frontend
│       └── imageUtils.ts
└── public/                    # Assets públicos
    └── images/               # Imágenes organizadas
```

**Tecnologías:**
- Next.js 15 App Router
- React 19 Server Components
- TypeScript
- CSS Modules
- React Context API

---

### ⚙️ `backend`
**APIs, lógica de servidor y servicios**

```
Incluye:
├── src/
│   ├── app/api/               # Next.js API Routes
│   │   ├── auth/             # Autenticación
│   │   │   ├── [...nextauth]/
│   │   │   ├── register/
│   │   │   └── logout/
│   │   ├── products/         # CRUD productos
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   ├── categories/       # CRUD categorías
│   │   ├── orders/           # Gestión de órdenes
│   │   ├── users/            # Gestión de usuarios
│   │   ├── checkout/         # Proceso de pago
│   │   │   ├── create/
│   │   │   ├── confirm/
│   │   │   └── return/
│   │   ├── shipping/         # Chilexpress API
│   │   ├── admin/            # APIs admin
│   │   │   ├── products/
│   │   │   ├── inventory/
│   │   │   ├── sales/
│   │   │   ├── banners/
│   │   │   └── stats/
│   │   └── webhooks/         # Webhooks externos
│   ├── lib/                  # Lógica de negocio
│   │   ├── transbank.ts     # Integración Transbank
│   │   ├── chilexpress.ts   # Integración Chilexpress
│   │   ├── validation.ts    # Validaciones
│   │   ├── rate-limit.ts    # Rate limiting
│   │   └── email.ts         # Emails (futuro)
│   ├── auth.ts              # NextAuth config
│   ├── middleware.ts        # Middleware de protección
│   └── types/               # Types TypeScript
│       ├── api.ts
│       └── models.ts
└── scripts/                 # Scripts de utilidad
    ├── check-admin.ts
    └── seed-railway-complete.js
```

**Tecnologías:**
- Next.js API Routes
- NextAuth.js v5
- Zod (validación)
- bcryptjs (hashing)
- Transbank SDK
- Chilexpress API

---

### 🗄️ `prisma-database`
**Schema, migraciones y seeders de base de datos**

```
Incluye:
├── prisma/
│   ├── schema.prisma          # Schema de base de datos
│   │   # 14 modelos:
│   │   # - User
│   │   # - Product
│   │   # - Category
│   │   # - Order
│   │   # - OrderItem
│   │   # - Banner
│   │   # - InventoryMovement
│   │   # - Sale
│   │   # - Cart
│   │   # - CartItem
│   │   # - Wishlist
│   │   # - Review
│   │   # - Address
│   │   # - Payment
│   ├── migrations/           # Migraciones versionadas
│   │   ├── migration_lock.toml
│   │   ├── 20251105171427_init_izacas_ecommerce/
│   │   ├── 20251107182434_add_banners_model/
│   │   ├── 20251107185126_add_auth_security/
│   │   ├── 20251109015511_add_inventory_movements/
│   │   ├── 20251109034852_add_sales_system/
│   │   ├── 20251109044740_add_optional_sku/
│   │   ├── 20251110192759_add_guest_checkout/
│   │   ├── 20251110194040_make_zip_optional/
│   │   └── 20251110204223_add_transbank_fee/
│   └── seeders/              # Scripts de población
│       ├── seed.ts          # Seeder principal
│       ├── seed-admin.ts    # Usuario admin
│       ├── seed-all-categories-products.ts
│       ├── seed-banners.ts
│       ├── seed-tecnologia.ts
│       ├── seed-hogar.ts
│       ├── seed-herramientas.ts
│       ├── seed-juguetes.ts
│       ├── seed-actividad.ts
│       ├── seed-cuidadopersonal.ts
│       └── seed-electrohogar.ts
├── src/lib/
│   └── prisma.ts            # Cliente Prisma singleton
└── package.json
    # Scripts:
    # - prisma:generate
    # - prisma:migrate
    # - prisma:seed
    # - prisma:studio
```

**Tecnologías:**
- Prisma ORM 6.19.0
- PostgreSQL 14+
- TypeScript

**Comandos principales:**
```bash
# Generar cliente
npx prisma generate

# Crear migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones
npx prisma migrate deploy

# Poblar base de datos
npx prisma db seed

# Abrir Prisma Studio
npx prisma studio
```

---

### 🐳 `docker`
**Configuración de Docker y despliegue**

```
Incluye:
├── docker-compose.yml         # Compose principal (desarrollo)
├── docker-compose.3tier.yml   # Compose 3-tier (producción)
├── Dockerfile                 # Dockerfile principal
├── Dockerfile.frontend        # Frontend optimizado
├── Dockerfile.backend         # Backend optimizado
├── Dockerfile.railway         # Para Railway deploy
├── .dockerignore             # Archivos ignorados
├── start-docker.sh           # Script inicio Linux/Mac
├── start-docker.ps1          # Script inicio Windows
└── scripts/
    └── docker-healthcheck.sh # Health checks

Configuración incluida:
├── PostgreSQL container
├── Next.js frontend container
├── Backend API container
├── PgAdmin (opcional)
├── Redis (futuro)
└── Nginx reverse proxy (producción)
```

**docker-compose.yml sanitizado:**
```yaml
version: '3.8'

services:
  database:
    image: postgres:14
    environment:
      POSTGRES_DB: ecommerce_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD:-change-me}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@database:5432/ecommerce_db
      AUTH_SECRET: ${AUTH_SECRET:-generate-secure-secret}
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      - database

volumes:
  postgres_data:
```

**Tecnologías:**
- Docker 20+
- Docker Compose
- PostgreSQL 14
- Node.js 18 Alpine

---

## 🚀 Comandos para Crear las Ramas

### Opción 1: Comandos manuales

```bash
# Asegurarte de estar en master
git checkout master

# Crear rama frontend
git checkout -b frontend

# Crear rama backend
git checkout master
git checkout -b backend

# Crear rama prisma-database
git checkout master
git checkout -b prisma-database

# Crear rama docker
git checkout master
git checkout -b docker

# Volver a master
git checkout master
```

### Opción 2: Script PowerShell

```powershell
# create-project-branches.ps1
$branches = @("frontend", "backend", "prisma-database", "docker")

Write-Host "🌿 Creando ramas del proyecto..." -ForegroundColor Cyan

foreach ($branch in $branches) {
    $exists = git rev-parse --verify $branch 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "⏭️  Rama ya existe: $branch" -ForegroundColor Yellow
    } else {
        git checkout -b $branch master 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Rama creada: $branch" -ForegroundColor Green
            git checkout master 2>$null
        }
    }
}

Write-Host "✅ Ramas creadas exitosamente" -ForegroundColor Green
git branch --list
```

---

## 📝 README para cada Rama

### README-FRONTEND.md
```markdown
# 🎨 Frontend - Tienda Virtual

Componentes React, páginas Next.js y estilos del proyecto.

## Estructura
- App Router Next.js 15
- 40+ componentes React
- 7 categorías de productos
- Sistema de carrito y wishlist
- Diseño 100% responsivo

## Tecnologías
- Next.js 15, React 19, TypeScript, CSS Modules

## Ejecutar
\`\`\`bash
npm install
npm run dev
\`\`\`
```

### README-BACKEND.md
```markdown
# ⚙️ Backend - Tienda Virtual

APIs REST, autenticación y lógica de negocio.

## Estructura
- 30+ API Routes
- NextAuth.js v5
- Integración Transbank
- Integración Chilexpress

## Tecnologías
- Next.js API Routes, NextAuth, Zod, bcryptjs

## APIs principales
- /api/auth/* - Autenticación
- /api/products/* - CRUD productos
- /api/checkout/* - Pagos
- /api/admin/* - Panel admin
```

### README-PRISMA-DATABASE.md
```markdown
# 🗄️ Prisma Database - Tienda Virtual

Schema, migraciones y seeders de PostgreSQL.

## Modelos (14)
User, Product, Category, Order, OrderItem, Banner, etc.

## Comandos
\`\`\`bash
npx prisma generate    # Generar cliente
npx prisma migrate dev # Migrar
npx prisma db seed     # Poblar
npx prisma studio      # GUI
\`\`\`
```

### README-DOCKER.md
```markdown
# 🐳 Docker - Tienda Virtual

Configuración de containers y despliegue.

## Servicios
- PostgreSQL 14
- Next.js App
- PgAdmin (opcional)

## Ejecutar
\`\`\`bash
docker-compose up -d
docker-compose logs -f
docker-compose down
\`\`\`
```

---

## 🔄 Flujo de Trabajo

### 1. Trabajar en una rama específica
```bash
# Frontend
git checkout frontend
# hacer cambios...
git add .
git commit -m "feat(frontend): agregar componente X"
git push origin frontend

# Backend
git checkout backend
# hacer cambios...
git add .
git commit -m "feat(backend): agregar API Y"
git push origin backend
```

### 2. Integrar cambios a master
```bash
git checkout master
git merge frontend
git merge backend
git merge prisma-database
git merge docker
git push origin master
```

### 3. Sincronizar ramas
```bash
# Actualizar todas las ramas con cambios de master
git checkout frontend
git merge master
git push origin frontend

git checkout backend
git merge master
git push origin backend

# ... repetir para otras ramas
```

---

## 📊 Distribución del Código

| Rama | Archivos | % del Proyecto | LOC aprox. |
|------|----------|----------------|------------|
| `frontend` | ~80 archivos | 45% | ~8,000 |
| `backend` | ~45 archivos | 30% | ~4,500 |
| `prisma-database` | ~25 archivos | 15% | ~2,000 |
| `docker` | ~10 archivos | 10% | ~500 |

---

## ✅ Checklist de Subida

### Frontend
- [ ] Componentes sin datos del cliente
- [ ] Estilos sanitizados
- [ ] README-FRONTEND.md creado
- [ ] .env.example incluido

### Backend
- [ ] APIs sin secrets reales
- [ ] Validaciones incluidas
- [ ] README-BACKEND.md creado
- [ ] Middleware documentado

### Prisma Database
- [ ] Schema sanitizado
- [ ] Migraciones versionadas
- [ ] Seeders con datos de ejemplo
- [ ] README-PRISMA-DATABASE.md creado

### Docker
- [ ] Passwords como variables
- [ ] docker-compose.yml sanitizado
- [ ] Scripts de inicio incluidos
- [ ] README-DOCKER.md creado

---

## 🌐 Deploy en Vercel

**Rama conectada**: `master`

### Variables de entorno en Vercel:
```env
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://tu-dominio.vercel.app
TRANSBANK_COMMERCE_CODE=...
TRANSBANK_API_KEY=...
```

### Build Settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

---

## 📚 Recursos

- [Documentación Next.js](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Docker Docs](https://docs.docker.com)
- [Vercel Docs](https://vercel.com/docs)

---

**✨ Repositorio**: https://github.com/karlascs/tienda-virtual.git  
**🚀 Deploy**: En Vercel  
**📦 Organización**: 4 ramas principales (frontend, backend, prisma-database, docker)
