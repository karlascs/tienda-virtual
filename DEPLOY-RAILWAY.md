# 🚂 Guía de Despliegue en Railway

## 📋 Prerrequisitos

✅ Cuenta en Railway (https://railway.app/)  
✅ Repositorio GitHub con el código subido  
✅ Dockerfile configurado (ya lo tienes)  
✅ docker-compose.yml configurado (ya lo tienes)

---

## 🎯 Opción 1: Deploy desde GitHub (Recomendado)

### Paso 1: Crear Proyecto en Railway

1. Ve a https://railway.app/
2. Click en **"Start a New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway a acceder a tu GitHub
5. Selecciona el repositorio `karlascs/iza-y-cas`
6. Railway detectará automáticamente el Dockerfile

### Paso 2: Agregar PostgreSQL

1. En el proyecto, click en **"+ New"**
2. Selecciona **"Database"**
3. Elige **"Add PostgreSQL"**
4. Railway creará una base de datos automáticamente
5. Copia la **DATABASE_URL** (se genera automáticamente)

### Paso 3: Configurar Variables de Entorno

En el servicio de Next.js, ve a **"Variables"** y agrega:

```bash
# Base de datos (Railway la genera automáticamente al conectar)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# NextAuth
AUTH_SECRET=genera-un-secreto-super-seguro-con-openssl-rand-base64-32
NEXTAUTH_URL=https://tu-app.up.railway.app

# Transbank (Integración para pruebas)
TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
TRANSBANK_ENVIRONMENT=integration

# Chilexpress (Opcional - usa fallback si no está)
CHILEXPRESS_API_KEY=tu-api-key-si-tienes
CHILEXPRESS_API_URL=https://testservices.wschilexpress.com

# Google Maps (Opcional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu-api-key-si-tienes

# Store Config
NEXT_PUBLIC_STORE_NAME=IZA&CAS
NEXT_PUBLIC_STORE_ADDRESS=Simón Bolívar 485, 2390030 Valparaíso, Chile
NEXT_PUBLIC_STORE_PHONE=+56912345678
NEXT_PUBLIC_STORE_EMAIL=contacto@izacas.cl

# Node.js
NODE_ENV=production
```

### Paso 4: Generar AUTH_SECRET

En tu terminal local:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copia el resultado y úsalo como `AUTH_SECRET`

### Paso 5: Configurar Build

Railway debería detectar automáticamente:
- **Build Command**: `npm run build`
- **Start Command**: `node server.js`

Si no lo detecta, configura manualmente en **"Settings"**:
- Root Directory: `/`
- Build Command: `npm ci && npx prisma generate && npm run build`
- Start Command: `npx prisma migrate deploy && node server.js`

### Paso 6: Deploy

1. Railway comenzará a construir automáticamente
2. Espera 5-10 minutos para el primer deploy
3. Una vez completado, obtendrás una URL como: `https://tu-app.up.railway.app`

### Paso 7: Ejecutar Migraciones

Railway ejecutará automáticamente las migraciones con el comando:
```bash
npx prisma migrate deploy
```

Si necesitas ejecutarlas manualmente:
1. Ve a tu servicio en Railway
2. Click en **"Terminal"** (beta)
3. Ejecuta:
```bash
npx prisma migrate deploy
npx prisma db seed  # Si quieres datos de prueba
```

### Paso 8: Crear Usuario Administrador

Opción A - Desde Railway Terminal:
```bash
npx ts-node scripts/check-admin.ts
```

Opción B - Desde Prisma Studio:
1. En Railway, ve a tu base de datos
2. Click en **"Prisma Studio"**
3. Crea un usuario con role `ADMIN`

Credenciales por defecto:
- Email: `admin@izacas.com`
- Password: `Admin123!` (hasheada con bcrypt)

---

## 🎯 Opción 2: Deploy con Railway CLI

### Paso 1: Instalar Railway CLI

```bash
npm i -g @railway/cli
```

### Paso 2: Login

```bash
railway login
```

### Paso 3: Inicializar Proyecto

```bash
cd "C:\Users\Karla\Desktop\proyecto fron end\tienda-next"
railway init
```

### Paso 4: Agregar PostgreSQL

```bash
railway add --database postgres
```

### Paso 5: Configurar Variables

```bash
railway variables set AUTH_SECRET="tu-secreto-generado"
railway variables set TRANSBANK_COMMERCE_CODE="597055555532"
railway variables set TRANSBANK_API_KEY="579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C"
# ... etc
```

### Paso 6: Deploy

```bash
railway up
```

### Paso 7: Abrir en Navegador

```bash
railway open
```

---

## 🎯 Opción 3: Docker Local (Testing)

### Paso 1: Probar Docker Localmente

```bash
# Build de la imagen
docker build -t izacas-ecommerce .

# Ejecutar contenedor con variables de entorno
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://usuario:password@host:5432/db" \
  -e AUTH_SECRET="tu-secreto" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  izacas-ecommerce
```

### Paso 2: O usar Docker Compose

```bash
# Iniciar todo (Next.js + PostgreSQL + PgAdmin)
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Detener
docker-compose down
```

Servicios disponibles:
- **App**: http://localhost:3000
- **PgAdmin**: http://localhost:5050 (admin@izacas.com / admin123)

---

## 🔧 Troubleshooting

### Error: "Prisma Client no generado"

Railway Terminal:
```bash
npx prisma generate
railway restart
```

### Error: "No se puede conectar a la base de datos"

1. Verifica que la variable `DATABASE_URL` esté configurada
2. Verifica que el servicio de PostgreSQL esté corriendo
3. Revisa los logs: `railway logs`

### Error: "Build falla por falta de memoria"

En Railway Settings:
- Aumentar el plan (Railway Pro tiene más recursos)
- O optimizar el build eliminando dependencias no usadas

### Error: "NEXTAUTH_SECRET no definido"

Genera uno nuevo:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Y agrégalo en Railway Variables

---

## 📊 Monitoreo en Railway

### Ver Logs en Tiempo Real

1. Ve a tu proyecto en Railway
2. Click en el servicio
3. Ve a **"Logs"**
4. Observa los logs en tiempo real

### Métricas

Railway muestra automáticamente:
- **CPU Usage**
- **Memory Usage**
- **Network I/O**
- **Build Time**

### Alertas

Configura alertas en **"Settings"** → **"Alerts"**

---

## 💰 Costos Estimados

### Railway Pricing

- **Hobby Plan** (Gratis): 
  - $5 crédito mensual
  - 500 horas de ejecución
  - 1GB RAM
  - 1GB almacenamiento

- **Pro Plan** ($20/mes):
  - 8GB RAM
  - 100GB almacenamiento
  - Priority support

### Optimización de Costos

1. **Sleep mode**: Railway duerme apps inactivas por 5 minutos (Hobby)
2. **Optimize builds**: Usar cache de Docker
3. **Database**: PostgreSQL incluido en créditos

---

## 🚀 Post-Deploy Checklist

- [ ] Verificar que la app carga correctamente
- [ ] Probar login de administrador
- [ ] Verificar conexión a base de datos
- [ ] Probar agregar/editar productos
- [ ] Verificar checkout y Transbank (modo integración)
- [ ] Probar Chilexpress cotizaciones
- [ ] Verificar responsive en móviles
- [ ] Configurar dominio personalizado (opcional)
- [ ] Configurar SSL (Railway lo hace automático)
- [ ] Monitorear logs por errores

---

## 🌐 Configurar Dominio Personalizado (Opcional)

### En Railway

1. Ve a **"Settings"** → **"Domains"**
2. Click en **"Custom Domain"**
3. Ingresa tu dominio: `www.izacas.cl`
4. Railway te dará registros DNS:
   - `CNAME` apuntando a Railway
5. Configura en tu proveedor DNS
6. Espera propagación (5-30 minutos)

### Actualizar Variables

```bash
NEXTAUTH_URL=https://www.izacas.cl
```

---

## 📝 Comandos Útiles

```bash
# Ver logs
railway logs

# Abrir app en navegador
railway open

# Ejecutar comandos en el contenedor
railway run npx prisma studio

# Ver variables
railway variables

# Restart
railway restart

# Status
railway status
```

---

## 🔒 Seguridad en Producción

Antes de cambiar a producción:

1. **Transbank**: Cambiar a credenciales de producción
2. **AUTH_SECRET**: Usar uno generado aleatoriamente
3. **Database**: Backup automático configurado
4. **Rate Limiting**: Ya está implementado
5. **HTTPS**: Railway lo maneja automáticamente
6. **Environment**: Cambiar `NODE_ENV=production`

---

## 🎉 ¡Listo!

Tu e-commerce IZA&CAS estará disponible en:
- **Railway URL**: https://tu-app.up.railway.app
- **Custom Domain**: https://www.izacas.cl (si lo configuras)

### Próximos Pasos

1. Poblar base de datos con productos reales
2. Configurar credenciales de Transbank producción
3. Obtener API keys de Chilexpress
4. Configurar Google Maps API
5. Agregar Google Analytics
6. Configurar backups automáticos
7. Monitorear performance

---

¿Tienes dudas? Consulta:
- Railway Docs: https://docs.railway.app/
- Next.js Deployment: https://nextjs.org/docs/deployment
- Prisma Railway: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway
