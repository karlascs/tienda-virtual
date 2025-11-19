# Configuración de Variables de Entorno para Vercel

## 🚨 PROBLEMA ACTUAL
Vercel está mostrando error 500 en `/api/banners` y `/api/products` porque las API routes de Next.js necesitan conexión a la base de datos.

## ✅ SOLUCIÓN

### Paso 1: Obtener DATABASE_URL de Railway

1. Ve a **Railway Dashboard**: https://railway.app
2. Selecciona tu proyecto
3. Click en el servicio **PostgreSQL** (base de datos)
4. Ve a la pestaña **Variables**
5. Busca `DATABASE_URL` y copia el valor completo

   Ejemplo:
   ```
   postgresql://postgres:contraseña@host.railway.internal:5432/railway
   ```

6. **IMPORTANTE**: Cambia `host.railway.internal` por el **host público**
   - Ve a **Settings** → **Networking**
   - Copia el **Public TCP Proxy** (ejemplo: `monorail.proxy.rlwy.net:12345`)
   - Reemplaza en la URL:
   ```
   postgresql://postgres:contraseña@monorail.proxy.rlwy.net:12345/railway
   ```

### Paso 2: Agregar Variables en Vercel

1. Ve a **Vercel Dashboard**: https://vercel.com
2. Selecciona tu proyecto **iza-y-cas**
3. Ve a **Settings** → **Environment Variables**
4. Agrega las siguientes variables:

#### Variables Requeridas:

```bash
# Base de datos (Railway PostgreSQL público)
DATABASE_URL=postgresql://postgres:TU_PASSWORD@monorail.proxy.rlwy.net:PORT/railway

# Autenticación NextAuth
AUTH_SECRET=85c9MFNVPG6fUsU6c0EeNa0LTJtKvMlcy77Js+10jIcMsSNtgnFT2pnY8GNRtkb16SEYX4PdqA+ODPZKgTpLFg==
NEXTAUTH_URL=https://iza-y-cas.vercel.app

# API Backend Railway (para llamadas desde frontend)
NEXT_PUBLIC_API_URL=https://iza-y-cas-production.up.railway.app

# Node Environment
NODE_ENV=production
```

#### Variables Opcionales (Transbank, etc):

```bash
# Transbank WebPay Plus
TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
TRANSBANK_ENVIRONMENT=integration
TRANSBANK_RETURN_URL=https://iza-y-cas.vercel.app/checkout/return
TRANSBANK_FINAL_URL=https://iza-y-cas.vercel.app/checkout/success

# Chilexpress
CHILEXPRESS_API_KEY=tu_api_key_si_tienes
CHILEXPRESS_ENV=sandbox

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_si_tienes
```

### Paso 3: Redeploy en Vercel

1. Ve a **Deployments**
2. Click en los **3 puntos** del último deployment
3. Selecciona **Redeploy**
4. Espera a que termine (2-3 minutos)

### Paso 4: Verificar

1. Ve a https://iza-y-cas.vercel.app
2. Abre **DevTools** (F12) → **Console**
3. Refresca la página
4. **No deberían aparecer errores 500**

---

## 🔍 Verificación de Logs

### En Vercel:
- Ve a **Deployments** → Click en el último deploy → **Functions**
- Revisa los logs de las API routes

### En Railway:
- Ve a tu proyecto → Click en el servicio backend
- Revisa los **Logs** para ver las peticiones

---

## 📊 Arquitectura Final

```
Usuario
   ↓
Vercel Frontend (iza-y-cas.vercel.app)
   ↓
┌──────────────────────────┐
│ Opción A: API Routes     │ → PostgreSQL Railway (público)
│ (/api/products, etc)     │
└──────────────────────────┘
   ↓
┌──────────────────────────┐
│ Opción B: Railway API    │ → PostgreSQL Railway (interno)
│ (NEXT_PUBLIC_API_URL)    │
└──────────────────────────┘
```

Con `DATABASE_URL` en Vercel, ambas opciones funcionan.

---

## ❓ Preguntas Frecuentes

**P: ¿Por qué necesito DATABASE_URL en Vercel si tengo Railway backend?**  
R: Las API routes de Next.js (`/api/*`) se ejecutan en Vercel, no en Railway. Necesitan su propia conexión a la BD.

**P: ¿Es seguro exponer PostgreSQL públicamente?**  
R: Sí, Railway usa autenticación con usuario/contraseña. Solo asegúrate de usar contraseñas seguras.

**P: ¿Puedo usar solo Railway backend y eliminar las API routes de Vercel?**  
R: Sí, pero perderías funcionalidades como admin panel, auth, etc. Mejor tener ambos.

---

## 🛠️ Solución Alternativa (Sin DATABASE_URL en Vercel)

Si no quieres exponer la BD públicamente, puedes hacer que todas las llamadas vayan a Railway:

1. Elimina las API routes de Vercel (carpeta `src/app/api/`)
2. Asegúrate de que `NEXT_PUBLIC_API_URL` esté en Vercel
3. Todas las llamadas irán a Railway backend

**Desventaja**: Perdería funcionalidades del admin panel y autenticación.
