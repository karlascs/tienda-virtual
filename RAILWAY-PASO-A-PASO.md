# 🚂 Railway - Configuración Paso a Paso

## ✅ Estado Actual
Tu app ya está en Railway y el BUILD es exitoso. Ahora necesitas configurar las variables de entorno.

---

## 📍 PASO 1: Ir a Railway Dashboard

1. Abre tu navegador
2. Ve a: **https://railway.app/dashboard**
3. Verás tu proyecto (iza-y-cas o similar)
4. **Click en el proyecto** para abrirlo

---

## 📍 PASO 2: Agregar Base de Datos PostgreSQL

### ¿Ya tienes PostgreSQL?
Mira tu proyecto. Si ves **DOS servicios/cajas**:
- ✅ Una con ícono de GitHub (tu app)
- ✅ Una con ícono de base de datos (PostgreSQL)

**Si solo ves UNA caja** (tu app), entonces necesitas agregar PostgreSQL:

### Cómo agregar PostgreSQL:

```
1. Busca el botón "+ New" (esquina superior derecha)
   
2. Click en "+ New"

3. Se abre un menú, selecciona: "Database"

4. Aparecen opciones de bases de datos, click en: "PostgreSQL"

5. Railway creará PostgreSQL automáticamente (30 segundos)

6. Ahora verás DOS servicios en tu proyecto ✅
```

---

## 📍 PASO 3: Configurar Variables de Entorno

### Ir a Variables:

```
1. Click en tu servicio de la APP (el que tiene ícono de GitHub)
   NO clicks en PostgreSQL, sino en tu app

2. Arriba verás pestañas:
   [Deployments] [Variables] [Metrics] [Settings]
   
3. Click en "Variables"

4. Verás la sección para agregar variables
```

### Agregar Variables (una por una):

En Railway, en la sección de Variables, agrega cada una de estas:

---

**Variable 1: DATABASE_URL**
```
Name:  DATABASE_URL
Value: ${{Postgres.DATABASE_URL}}
```
⚠️ Importante: Copia exactamente `${{Postgres.DATABASE_URL}}` - Railway lo reemplazará automáticamente

---

**Variable 2: AUTH_SECRET**
```
Name:  AUTH_SECRET
Value: ClLVfo1Ia7rOFAZQ+iCqlsy25PJdRJi+ArCbBc3TLBs=
```

---

**Variable 3: NEXTAUTH_URL**
```
Name:  NEXTAUTH_URL
Value: https://${{RAILWAY_PUBLIC_DOMAIN}}
```
⚠️ Railway reemplazará automáticamente con tu dominio

---

**Variable 4: NODE_ENV**
```
Name:  NODE_ENV
Value: production
```

---

**Variable 5: TRANSBANK_COMMERCE_CODE**
```
Name:  TRANSBANK_COMMERCE_CODE
Value: 597055555532
```

---

**Variable 6: TRANSBANK_API_KEY**
```
Name:  TRANSBANK_API_KEY
Value: 579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
```

---

**Variable 7: TRANSBANK_ENVIRONMENT**
```
Name:  TRANSBANK_ENVIRONMENT
Value: integration
```

---

**Variable 8: NEXT_PUBLIC_STORE_NAME**
```
Name:  NEXT_PUBLIC_STORE_NAME
Value: IZA&CAS
```

---

**Variable 9: NEXT_PUBLIC_STORE_ADDRESS**
```
Name:  NEXT_PUBLIC_STORE_ADDRESS
Value: Simón Bolívar 485, 2390030 Valparaíso, Chile
```

---

**Variable 10: NEXT_PUBLIC_STORE_PHONE**
```
Name:  NEXT_PUBLIC_STORE_PHONE
Value: +56912345678
```

---

**Variable 11: NEXT_PUBLIC_STORE_EMAIL**
```
Name:  NEXT_PUBLIC_STORE_EMAIL
Value: contacto@izacas.cl
```

---

## 📍 PASO 4: Redeploy

Una vez agregadas TODAS las variables:

```
1. Ve a la pestaña "Deployments" (arriba)

2. Verás tu último deployment

3. Click en el botón de 3 puntos "..." (arriba a la derecha)

4. Click en "Redeploy" o "Restart"

5. Railway reconstruirá con las variables configuradas
```

---

## 📍 PASO 5: Generar Dominio Público

Para acceder a tu app:

```
1. En tu servicio (el de la app), ve a "Settings"

2. Busca la sección "Networking" o "Domains"

3. Click en "Generate Domain"

4. Railway te dará una URL como:
   https://iza-y-cas-production.up.railway.app

5. ¡Copia esa URL! Es tu app en producción
```

---

## 📍 PASO 6: Ejecutar Migraciones de Base de Datos

Tu app necesita crear las tablas en PostgreSQL:

### Opción A - Railway ejecuta automáticamente:
Si configuraste el start command correcto, Railway ejecutará las migraciones al iniciar.

### Opción B - Ejecutar manualmente desde tu PC:

```powershell
# En tu terminal local (PowerShell):

# 1. Copia el DATABASE_URL de Railway:
#    Ve a PostgreSQL → Variables → Copia DATABASE_URL

# 2. Ejecuta las migraciones:
$env:DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:xxxx/railway"
npx prisma migrate deploy
npx ts-node prisma/seeders/seed-admin.ts
```

---

## 📍 PASO 7: Verificar que Funciona

Abre tu URL de Railway en el navegador:

✅ **Debe funcionar:**
- Página principal carga
- Puedes ver productos (si cargaste datos)
- Puedes hacer login
- Panel de administración funciona

❌ **Si hay errores:**
- Ve a "Logs" en Railway
- Verás los errores en tiempo real
- Comparte el error conmigo para ayudarte

---

## 🆘 Problemas Comunes

### Error: "Cannot connect to database"
**Solución:** Verifica que `DATABASE_URL=${{Postgres.DATABASE_URL}}` esté en Variables

### Error: "NEXTAUTH_SECRET is not defined"
**Solución:** Verifica que `AUTH_SECRET` esté configurado

### Error: "Application failed to respond"
**Solución:** 
1. Ve a Settings → Deploy
2. Verifica que el Start Command sea: `node server.js`
3. O usa: `npx prisma migrate deploy && node server.js`

### No puedo acceder a la URL
**Solución:**
1. Ve a Settings → Networking
2. Genera un dominio público
3. Espera 1-2 minutos a que propague

---

## 📊 Resumen de lo que necesitas:

- [ ] PostgreSQL agregado (ver 2 servicios en el proyecto)
- [ ] 11 variables de entorno configuradas
- [ ] Redeploy ejecutado
- [ ] Dominio público generado
- [ ] Migraciones ejecutadas
- [ ] App funcionando en la URL

---

## 💡 Consejos

- Railway detecta automáticamente cambios de GitHub y redeploys
- Los logs están en tiempo real en la pestaña "Logs"
- Puedes ver métricas en "Metrics" (CPU, RAM, requests)
- El plan gratuito tiene $5 USD de crédito mensual
- Si se acaba, necesitas upgrade a Pro ($20/mes)

---

## ✨ Próximos Pasos Después del Deploy

1. Probar checkout completo
2. Verificar integración con Transbank
3. Cargar productos reales
4. Configurar dominio personalizado (opcional)
5. Cambiar Transbank a producción cuando estés listo

---

¿En qué paso estás? Dime si necesitas ayuda con alguno específico.
