# 🚀 Guía de Deploy: Vercel + Railway

Esta guía te ayudará a deployar **IZA&CAS E-commerce** usando una arquitectura separada:
- **Vercel**: Frontend Next.js (optimizado y gratis)
- **Railway**: Backend API + PostgreSQL (base de datos persistente)

---

## 📋 Requisitos Previos

- ✅ Cuenta en [Vercel](https://vercel.com) (gratis)
- ✅ Cuenta en [Railway](https://railway.app) (hobby plan)
- ✅ Repositorio en GitHub actualizado

---

## 🗂️ PARTE 1: Deploy del Backend en Railway

### 1.1 Crear Nuevo Servicio en Railway

1. Ve a Railway → **New Project**
2. Selecciona **Deploy from GitHub repo**
3. Elige el repo: `karlascs/iza-y-cas`
4. En "Settings" → **Root Directory**: deja vacío (/)
5. En "Settings" → **Custom Start Command**: (dejar vacío, usa Dockerfile)

### 1.2 Configurar PostgreSQL

1. En tu proyecto Railway, clic en **+ New**
2. Selecciona **Database → PostgreSQL**
3. Espera a que se cree la base de datos

### 1.3 Variables de Entorno del Backend

Ve al servicio del backend → **Variables** y agrega:

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
FRONTEND_URL=https://tu-app.vercel.app
PORT=4000
NODE_ENV=production
```

### 1.4 Configurar Dockerfile

En Railway → **Settings** → **Build**:
- **Dockerfile Path**: `Dockerfile.backend`
- **Watch Paths**: `backend/**, prisma/**`

### 1.5 Deploy

Railway detectará los cambios y hará deploy automáticamente.

**URL del backend**: Anota la URL que te da Railway, algo como:
```
https://iza-y-cas-backend-production.up.railway.app
```

---

## 🌐 PARTE 2: Deploy del Frontend en Vercel

### 2.1 Conectar Repositorio

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Clic en **Add New** → **Project**
3. Importa tu repo: `karlascs/iza-y-cas`
4. Framework Preset: **Next.js** (detectado automáticamente)

### 2.2 Variables de Entorno en Vercel

En **Environment Variables**, agrega:

```bash
# URL del backend en Railway
NEXT_PUBLIC_API_URL=https://iza-y-cas-backend-production.up.railway.app

# NextAuth (generar con: openssl rand -base64 64)
AUTH_SECRET=tu_secret_generado_aqui

# URL de tu app en Vercel (se completa después del primer deploy)
NEXTAUTH_URL=https://tu-app.vercel.app
```

### 2.3 Configuración de Build

Vercel detectará automáticamente Next.js, pero verifica:
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (automático)
- **Install Command**: `npm install`

### 2.4 Deploy

Clic en **Deploy** y espera 2-3 minutos.

**URL de tu app**: Vercel te dará una URL como:
```
https://iza-y-cas.vercel.app
```

### 2.5 Actualizar Variables

Ahora que tienes la URL de Vercel:

1. **En Railway** → Backend → Variables:
   - Actualiza `FRONTEND_URL` con tu URL de Vercel
   
2. **En Vercel** → Settings → Environment Variables:
   - Actualiza `NEXTAUTH_URL` con tu URL de Vercel
   - Clic en **Redeploy** para aplicar cambios

---

## 🔄 PARTE 3: Cargar Productos

### 3.1 Crear Usuario Admin

Desde tu terminal local:

```bash
cd tienda-next
node scripts/create-railway-admin.js
```

Esto te dará un script SQL. Ejecútalo en Railway:
1. Railway → PostgreSQL → **Data** → **Query**
2. Pega el SQL y ejecuta

### 3.2 Cargar Productos

Hay dos opciones:

**Opción A: Desde Postman o Thunder Client**
```
POST https://tu-backend-railway.up.railway.app/api/admin/seed-products
Headers:
  Content-Type: application/json
Body:
  { "products": [ ...array de productos... ] }
```

**Opción B: Script Node.js**
```bash
node scripts/seed-railway-complete.js
```

---

## ✅ Verificación Final

1. **Backend Funcionando**:
   ```
   https://tu-backend-railway.up.railway.app/api/health
   ```
   Debería responder: `{"status":"ok"}`

2. **Frontend Funcionando**:
   ```
   https://tu-app.vercel.app
   ```
   Debería cargar la tienda

3. **Productos Visibles**:
   - Ve a cualquier categoría
   - Verifica que se muestren productos con imágenes

4. **Login Funcional**:
   - Clic en "Iniciar Sesión"
   - Usa: `admin@izacas.com` / `Admin123!`
   - Deberías poder entrar al panel admin

---

## 🐛 Troubleshooting

### Error: "API not responding"
- Verifica que `NEXT_PUBLIC_API_URL` en Vercel esté correcta
- Verifica que el backend en Railway esté "Running" (verde)

### Error: "CORS policy"
- Verifica que `FRONTEND_URL` en Railway esté correcta
- Debe coincidir EXACTAMENTE con tu URL de Vercel

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` en Railway sea: `${{Postgres.DATABASE_URL}}`
- Verifica que el servicio PostgreSQL esté activo

### Imágenes no se ven
- Las imágenes deben estar en `/public/images/` en el repo
- Vercel sirve automáticamente archivos de `/public`
- Verifica rutas en productos: `/images/categoria/producto.jpg`

---

## 📊 Arquitectura Final

```
┌─────────────────────────────────────┐
│         VERCEL (Frontend)           │
│  ✓ Next.js 15 (Pages + Components)  │
│  ✓ Imágenes desde /public            │
│  ✓ NextAuth para autenticación       │
│  ✓ Deploy automático desde GitHub    │
└─────────────┬───────────────────────┘
              │
              │ fetch(NEXT_PUBLIC_API_URL)
              │
              ↓
┌─────────────────────────────────────┐
│        RAILWAY (Backend)             │
│  ┌───────────────────────────────┐  │
│  │   Express API (Node.js)       │  │
│  │   ✓ /api/products             │  │
│  │   ✓ /api/categories           │  │
│  │   ✓ /api/orders               │  │
│  │   ✓ /api/cart                 │  │
│  └──────────┬────────────────────┘  │
│             │                        │
│             │ Prisma ORM             │
│             ↓                        │
│  ┌───────────────────────────────┐  │
│  │     PostgreSQL Database       │  │
│  │   ✓ Productos                 │  │
│  │   ✓ Categorías                │  │
│  │   ✓ Usuarios                  │  │
│  │   ✓ Órdenes                   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## 🎉 ¡Listo!

Tu tienda ahora está deployada con:
- ✅ Frontend rápido en Vercel
- ✅ Backend escalable en Railway
- ✅ Base de datos persistente PostgreSQL
- ✅ Deploy automático con git push
- ✅ HTTPS habilitado automáticamente

**URLs Finales:**
- Frontend: https://iza-y-cas.vercel.app
- Backend: https://iza-y-cas-backend.up.railway.app
- Admin: https://iza-y-cas.vercel.app/admin
