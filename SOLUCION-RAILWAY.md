# 🚨 SOLUCIÓN: Problemas en Railway

## 📋 Problemas Reportados

1. ❌ **Imágenes no se ven**
2. ❌ **Secciones no cargan**
3. ❌ **No se puede entrar a usuario**

---

## 🔍 DIAGNÓSTICO

### Problema 1: Imágenes No Se Ven

#### Causas Posibles:
- ✅ Las imágenes están en `/public/images/` pero no se copian al contenedor
- ✅ Rutas incorrectas en producción
- ✅ El `output: 'standalone'` de Next.js no incluye todas las imágenes

#### Verificación:
```bash
# En Railway Terminal o logs, verifica:
ls -la /app/public/images/
```

### Problema 2: Secciones No Cargan

#### Causas Posibles:
- ✅ Errores de JavaScript en producción
- ✅ Variables de entorno faltantes
- ✅ Build incompleto

### Problema 3: No Entrar a Usuario

#### Causas Posibles:
- ✅ `NEXTAUTH_URL` incorrecto
- ✅ `AUTH_SECRET` no configurado
- ✅ Base de datos no conectada
- ✅ Sesiones no funcionando

---

## 🛠️ SOLUCIONES

## SOLUCIÓN 1: Configurar Variables de Entorno en Railway

### Paso 1: Ve a tu proyecto en Railway
1. Abre https://railway.app
2. Selecciona tu proyecto IZA&CAS
3. Click en el servicio de Next.js
4. Ve a la pestaña **"Variables"**

### Paso 2: Agrega TODAS estas variables

```bash
# ============================================
# 1. BASE DE DATOS (CRÍTICO)
# ============================================
# Railway genera esto automáticamente si agregaste PostgreSQL
DATABASE_URL=${{Postgres.DATABASE_URL}}

# ============================================
# 2. AUTENTICACIÓN (CRÍTICO - SIN ESTO NO FUNCIONA LOGIN)
# ============================================
# Genera un nuevo secreto:
# Ejecuta en tu terminal local: node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
AUTH_SECRET=TU_SECRET_GENERADO_AQUI_64_CARACTERES

# IMPORTANTE: Cambia esto a tu URL REAL de Railway
# Ejemplo: https://tu-app-production.up.railway.app
NEXTAUTH_URL=https://TU-APP.up.railway.app

# ============================================
# 3. NODE ENVIRONMENT
# ============================================
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# ============================================
# 4. TRANSBANK (para pagos)
# ============================================
TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
TRANSBANK_ENVIRONMENT=integration

# Cambia estas URLs a tu dominio de Railway
TRANSBANK_RETURN_URL=https://TU-APP.up.railway.app/checkout/return
TRANSBANK_FINAL_URL=https://TU-APP.up.railway.app/checkout/success

# ============================================
# 5. CHILEXPRESS (opcional - usa fallback)
# ============================================
CHILEXPRESS_API_KEY=tu_api_key_si_tienes
CHILEXPRESS_ENV=sandbox

# ============================================
# 6. STORE INFO (público)
# ============================================
NEXT_PUBLIC_STORE_NAME=IZA&CAS
NEXT_PUBLIC_STORE_ADDRESS=Simón Bolívar 485, 2390030 Valparaíso, Chile
NEXT_PUBLIC_STORE_PHONE=+56912345678
NEXT_PUBLIC_STORE_EMAIL=contacto@izacas.cl
```

### Paso 3: Obtener tu URL de Railway

1. En Railway, ve a tu servicio
2. Ve a **"Settings"** → **"Domains"**
3. Copia la URL que dice algo como: `tu-app-production.up.railway.app`
4. **Reemplaza** `TU-APP` en las variables de arriba con tu URL real

### Paso 4: Generar AUTH_SECRET

En tu terminal local (PowerShell):
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

Copia el resultado y pégalo en `AUTH_SECRET`

---

## SOLUCIÓN 2: Arreglar Dockerfile para Imágenes

### Problema Detectado:
El `Dockerfile` actual no copia correctamente la carpeta `public/images/` completa.

### Crear Nuevo Dockerfile Optimizado:

Reemplaza tu `Dockerfile` con este:

```dockerfile
# Etapa 1: Construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración primero
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci

# Generar Prisma Client
RUN npx prisma generate

# Copiar código fuente
COPY src ./src
COPY public ./public


RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando con migración automática
CMD npx prisma migrate deploy && node server.js
```

---

## SOLUCIÓN 3: Verificar next.config.ts

Tu `next.config.ts` debe tener:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // IMPORTANTE: Output standalone para Docker
  output: 'standalone',
  
  // Configuración de imágenes
  images: {
    domains: ['localhost'],
    unoptimized: true, // Para Railway
  },
  
  // Asegurar compilación de todas las páginas
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
};

export default nextConfig;
```

---

## SOLUCIÓN 4: Crear Script de Deploy

Crea `railway.json` en la raíz del proyecto:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "npx prisma migrate deploy && node server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## SOLUCIÓN 5: Crear Usuario Admin en Railway

### Opción A: Desde Railway Terminal

1. En Railway, ve a tu servicio
2. Click en **"..."** → **"Terminal"**
3. Ejecuta:

```bash
# Crear usuario admin
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  const admin = await prisma.user.create({
    data: {
      name: 'Admin IZA&CAS',
      email: 'admin@izacas.com',
      hashedPassword: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    }
  });
  
  console.log('✅ Admin creado:', admin.email);
  process.exit(0);
}

createAdmin().catch(console.error);
"
```

### Opción B: Desde Script

Crea `scripts/create-railway-admin.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Creando usuario administrador...');
  
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@izacas.com' },
      update: {},
      create: {
        name: 'Admin IZA&CAS',
        email: 'admin@izacas.com',
        hashedPassword: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });
    
    console.log('✅ Usuario admin creado/actualizado:', admin.email);
    console.log('📧 Email: admin@izacas.com');
    console.log('🔑 Password: Admin123!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

Ejecutar en Railway:
```bash
node scripts/create-railway-admin.js
```

---

## SOLUCIÓN 6: Verificar Logs en Railway

### Ver Logs en Tiempo Real:

1. Ve a tu proyecto en Railway
2. Click en tu servicio
3. Ve a **"Logs"**
4. Busca errores:

#### Errores Comunes:

❌ **Error: "Prisma Client not generated"**
```bash
# Solución: Rebuild
railway up --detach
```

❌ **Error: "NEXTAUTH_URL is not set"**
```bash
# Solución: Agregar variable NEXTAUTH_URL en Railway
```

❌ **Error: "Database connection failed"**
```bash
# Solución: Verificar que DATABASE_URL esté configurada
```

❌ **Error: "Cannot find module '/app/server.js'"**
```bash
# Solución: Verificar que next.config.ts tenga output: 'standalone'
```

---

## SOLUCIÓN 7: Deploy Manual Paso a Paso

### En tu computadora local:

```powershell
# 1. Asegurar que el código esté actualizado
cd "C:\Users\Karla\Desktop\proyecto fron end\tienda-next"

# 2. Commit cambios
git add .
git commit -m "fix: Configurar para Railway con imágenes y auth"
git push origin master

# 3. Railway detectará el push y hará deploy automático
```

### En Railway:

1. **Espera el deploy** (5-10 minutos primera vez)
2. **Verifica logs** para errores
3. **Abre la app** desde Railway
4. **Prueba login** con admin@izacas.com / Admin123!

---

## ✅ CHECKLIST DE VERIFICACIÓN

Verifica que tengas TODO esto configurado en Railway:

### Variables de Entorno:
- [ ] `DATABASE_URL` configurada (auto-generada por Railway)
- [ ] `AUTH_SECRET` generado (64 caracteres base64)
- [ ] `NEXTAUTH_URL` con tu URL real de Railway
- [ ] `NODE_ENV=production`
- [ ] `TRANSBANK_COMMERCE_CODE` configurado
- [ ] `TRANSBANK_API_KEY` configurado
- [ ] `TRANSBANK_RETURN_URL` con tu dominio Railway
- [ ] `TRANSBANK_FINAL_URL` con tu dominio Railway

### Archivos:
- [ ] `Dockerfile` actualizado con copia de public completo
- [ ] `next.config.ts` con `output: 'standalone'`
- [ ] `railway.json` creado (opcional pero recomendado)

### Base de Datos:
- [ ] PostgreSQL agregado en Railway
- [ ] Migraciones ejecutadas (`prisma migrate deploy`)
- [ ] Usuario admin creado

### Testing:
- [ ] App abre sin errores en Railway URL
- [ ] Imágenes se ven correctamente
- [ ] Login funciona (admin@izacas.com)
- [ ] Páginas cargan correctamente

---

## 🚀 COMANDOS RÁPIDOS

### Generar AUTH_SECRET:
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

### Rebuild en Railway:
```bash
# Opción 1: Desde web
Railway → Deployments → ... → Redeploy

# Opción 2: Desde CLI
railway up
```

### Ver logs:
```bash
railway logs
```

### Ejecutar migraciones:
```bash
railway run npx prisma migrate deploy
```

### Crear admin:
```bash
railway run node scripts/create-railway-admin.js
```

---

## 🆘 SI NADA FUNCIONA

### Reset Completo:

1. **Eliminar servicio actual en Railway**
2. **Crear nuevo servicio**
3. **Agregar PostgreSQL**
4. **Configurar TODAS las variables de nuevo**
5. **Deploy desde GitHub**

### Verificar Localmente Primero:

```powershell
# Probar build local
npm run build
npm start

# Si funciona local pero no en Railway:
# - Problema de variables de entorno
# - Problema de Dockerfile
```

---

## 📞 CONTACTO DE EMERGENCIA

### Logs Más Comunes:

```
✅ BUILD EXITOSO:
[build] Build completed successfully
[deploy] Starting server...
[deploy] Server listening on port 3000

❌ BUILD FALLIDO:
[build] Error: Cannot find module
[build] Error: Prisma Client not generated

❌ RUNTIME ERROR:
[deploy] Error: NEXTAUTH_URL is not set
[deploy] Error: Database connection refused
```

### Pasos de Depuración:

1. **Ver logs completos** en Railway
2. **Copiar error exacto**
3. **Buscar en documentación**: https://docs.railway.app
4. **Verificar variables** una por una

---

## 💡 TIPS IMPORTANTES

### 1. Siempre usar URL completa de Railway
```bash
# ❌ MAL
NEXTAUTH_URL=http://localhost:3000

# ✅ BIEN
NEXTAUTH_URL=https://tu-app-production.up.railway.app
```

### 2. AUTH_SECRET debe ser único y largo
```bash
# ❌ MAL
AUTH_SECRET=123456

# ✅ BIEN
AUTH_SECRET=85c9MFNVPG6fUsU6c0EeNa0LTJtKvMlcy77Js+10jIcMsSNtgnFT2pnY8GNRtkb16SEYX4PdqA+ODPZKgTpLFg==
```

### 3. Transbank URLs deben apuntar a Railway
```bash
# ❌ MAL
TRANSBANK_RETURN_URL=http://localhost:3000/checkout/return

# ✅ BIEN
TRANSBANK_RETURN_URL=https://tu-app-production.up.railway.app/checkout/return
```

---

## 🎯 RESULTADO ESPERADO

Después de aplicar todas las soluciones:

✅ **Imágenes se ven**: Todas las imágenes de productos y categorías
✅ **Login funciona**: Puedes entrar con admin@izacas.com
✅ **Panel admin accesible**: /admin funciona correctamente
✅ **Secciones cargan**: Todas las páginas funcionan
✅ **Checkout funciona**: Proceso de pago completo
✅ **Sin errores en logs**: Railway logs sin errores críticos

---

## 📝 RESUMEN DE ACCIONES

### Para arreglar TODO ahora mismo:

1. **Actualizar Dockerfile** (copiar el de arriba)
2. **Crear railway.json** (copiar el de arriba)
3. **Actualizar next.config.ts** (agregar images.unoptimized)
4. **En Railway: Configurar TODAS las variables** (especialmente AUTH_SECRET y NEXTAUTH_URL)
5. **Hacer commit y push**
6. **Esperar deploy**
7. **Crear usuario admin** desde Railway Terminal
8. **Probar app**

### Tiempo estimado: 30-45 minutos

---

**¿Necesitas ayuda?** 
- Railway Docs: https://docs.railway.app
- Next.js Deploy: https://nextjs.org/docs/deployment
- Transbank Devs: https://www.transbankdevelopers.cl

---

**Última actualización**: 15 de noviembre de 2025
**Versión**: 1.0
**Estado**: Solución Completa para Problemas de Railway
