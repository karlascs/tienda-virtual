# 🚀 PASOS RÁPIDOS PARA ARREGLAR RAILWAY

## ⚡ RESUMEN DEL PROBLEMA

Tu app en Railway tiene 3 problemas:
1. ❌ Imágenes no se ven
2. ❌ Secciones no cargan
3. ❌ No puedes entrar como usuario

## 🎯 SOLUCIÓN EN 10 PASOS (30 minutos)

---

## PASO 1: Hacer Commit de los Cambios

Abre PowerShell en tu proyecto:

```powershell
cd "C:\Users\Karla\Desktop\proyecto fron end\tienda-next"

git add .
git commit -m "fix: Arreglar Railway - imágenes, auth y health check"
git push origin master
```

✅ Esto actualizará: Dockerfile, next.config.ts, railway.json, health check

---

## PASO 2: Abrir Railway

1. Ve a https://railway.app
2. Login con tu cuenta
3. Selecciona tu proyecto IZA&CAS

---

## PASO 3: Obtener tu URL de Railway

1. Click en tu servicio de Next.js
2. Ve a **"Settings"** → **"Domains"**
3. **Copia** la URL completa (ejemplo: `izacas-production.up.railway.app`)
4. **Guarda esta URL** - la necesitarás en el siguiente paso

---

## PASO 4: Configurar Variables de Entorno

1. En tu servicio, ve a la pestaña **"Variables"**
2. Click en **"+ New Variable"** o **"Raw Editor"**
3. **Pega TODAS estas variables** (reemplaza TU-APP con tu URL del paso 3):

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
TRANSBANK_ENVIRONMENT=integration
NEXT_PUBLIC_STORE_NAME=IZA&CAS
NEXT_PUBLIC_STORE_ADDRESS=Simón Bolívar 485, 2390030 Valparaíso, Chile
NEXT_PUBLIC_STORE_PHONE=+56912345678
NEXT_PUBLIC_STORE_EMAIL=contacto@izacas.cl
```

**IMPORTANTE:** Ahora agrega estas dos variables **con TU URL real**:

```bash
NEXTAUTH_URL=https://TU-APP.up.railway.app
TRANSBANK_RETURN_URL=https://TU-APP.up.railway.app/checkout/return
TRANSBANK_FINAL_URL=https://TU-APP.up.railway.app/checkout/success
```

---

## PASO 5: Generar y Agregar AUTH_SECRET

En PowerShell ejecuta:

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

1. **Copia el resultado** (será algo como: `85c9MFNVPG6fUsU6c0...`)
2. En Railway Variables, agrega:

```bash
AUTH_SECRET=TU_RESULTADO_COPIADO_AQUI
```

---

## PASO 6: Guardar y Esperar Deploy

1. Click **"Save"** o **"Deploy"**
2. Railway comenzará a hacer redeploy automáticamente
3. Ve a la pestaña **"Logs"** y observa el progreso
4. Espera 5-10 minutos hasta ver: `✅ Server listening on port 3000`

---

## PASO 7: Verificar que la App Abre

1. Ve a **"Settings"** → **"Domains"**
2. Click en tu URL
3. Debe abrir tu página de inicio (puede que sin productos aún)

Si no abre o da error 502, revisa los logs y verifica que todas las variables estén correctas.

---

## PASO 8: Ejecutar Migraciones

Si es la primera vez que despliegas:

1. En Railway, ve a tu servicio
2. Click en **"..."** → **"View Logs"**
3. Busca si dice: `Migrations completed` o similar

Si no corrieron las migraciones, hazlo manualmente:

**Opción A - Desde Railway Terminal:**
```bash
npx prisma migrate deploy
```

**Opción B - Desde tu PC con Railway CLI:**
```powershell
npm i -g @railway/cli
railway login
railway run npx prisma migrate deploy
```

---

## PASO 9: Crear Usuario Administrador

Ahora crea el usuario admin para poder entrar:

**Opción A - Comando Rápido en Railway Terminal:**

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@izacas.com' },
    update: { hashedPassword, role: 'ADMIN' },
    create: {
      name: 'Admin IZA&CAS',
      email: 'admin@izacas.com',
      hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date()
    }
  });
  console.log('✅ Admin creado:', admin.email);
  process.exit(0);
}
createAdmin();
"
```

**Opción B - Usando el script que creamos:**

```bash
node scripts/create-railway-admin.js
```

Debes ver:
```
✅ Usuario administrador creado exitosamente!
📧 Email: admin@izacas.com
🔑 Password: Admin123!
```

---

## PASO 10: Probar que Todo Funciona

### 1. Abrir tu app:
```
https://TU-APP.up.railway.app
```

### 2. Verificar imágenes:
- ¿Se ven las imágenes de categorías?
- ¿Se ven los productos con imágenes?

### 3. Probar login:
1. Click en "Iniciar Sesión"
2. Email: `admin@izacas.com`
3. Password: `Admin123!`
4. Debe entrar y ver "Admin Panel" en el header

### 4. Acceder al admin:
1. Click en "Admin Panel"
2. Debe abrir `/admin` con el dashboard

---

## ✅ CHECKLIST FINAL

Verifica que TODO esto funcione:

- [ ] App abre en Railway URL sin errores
- [ ] Se ven las imágenes de categorías en homepage
- [ ] Se ven las imágenes de productos en catálogo
- [ ] Botón "Iniciar Sesión" funciona
- [ ] Puedes entrar con admin@izacas.com / Admin123!
- [ ] Ves "Admin Panel" en el header después de login
- [ ] Puedes acceder a /admin
- [ ] Dashboard muestra estadísticas
- [ ] No hay errores en Railway logs

---

## 🐛 SI ALGO NO FUNCIONA

### Error: Imágenes aún no se ven
**Causa:** Dockerfile no copió las imágenes correctamente
**Solución:** 
1. Verifica que hiciste git push
2. Verifica en logs que el build se completó
3. Fuerza rebuild: Railway → "..." → "Redeploy"

### Error: No puedo hacer login
**Causa:** AUTH_SECRET o NEXTAUTH_URL mal configurados
**Solución:**
1. Ve a Variables en Railway
2. Verifica que `AUTH_SECRET` esté configurado (64 caracteres)
3. Verifica que `NEXTAUTH_URL` tenga tu URL real de Railway (con https://)
4. Guarda y espera redeploy

### Error: "Credenciales inválidas"
**Causa:** Usuario admin no existe en la base de datos
**Solución:** Repite el PASO 9 para crear el usuario

### Error: Build falla
**Causa:** Falta alguna configuración
**Solución:**
1. Revisa logs completos en Railway
2. Busca el error específico
3. Verifica que `DATABASE_URL` esté configurada
4. Verifica que todas las variables del PASO 4 estén

### Error: 502 Bad Gateway
**Causa:** App no inició correctamente
**Solución:**
1. Revisa logs en Railway
2. Busca errores de Prisma o base de datos
3. Verifica que las migraciones corrieron (PASO 8)

---

## 📞 COMANDO RÁPIDO DE VERIFICACIÓN

Copia y pega en Railway Terminal para verificar TODO:

```bash
echo "🔍 Verificando instalación..."
echo ""
echo "📁 Archivos públicos:"
ls -la public/ | head -5
echo ""
echo "🗄️ Base de datos:"
npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"User\";"
echo ""
echo "✅ Si ves archivos y número > 0, está bien configurado"
```

---

## 💡 TIPS IMPORTANTES

1. **Siempre usa https://** en las URLs de Railway (nunca http://)
2. **AUTH_SECRET debe ser único** - genera uno nuevo, no uses el del ejemplo
3. **Guarda las variables** antes de cerrar Railway
4. **Espera el deploy completo** antes de probar (5-10 minutos)
5. **Revisa los logs** si algo no funciona

---

## 🎉 CUANDO TODO FUNCIONE

Tu app debe:
- ✅ Abrir rápido (< 3 segundos)
- ✅ Mostrar todas las imágenes
- ✅ Permitir login de admin
- ✅ Tener panel admin funcional
- ✅ Sin errores en consola del navegador (F12)

---

## 📱 PRÓXIMOS PASOS

Después de que todo funcione:

1. **Poblar productos**: Ejecutar seeders con datos reales
2. **Configurar dominio**: Si tienes dominio propio (izacas.cl)
3. **Transbank producción**: Cuando tengas credenciales reales
4. **Monitoreo**: Configurar alertas en Railway
5. **Backups**: Configurar backups automáticos de BD

---

## 🆘 AYUDA RÁPIDA

### Documentación:
- Railway: https://docs.railway.app
- Next.js: https://nextjs.org/docs/deployment
- Prisma: https://www.prisma.io/docs

### Comandos útiles:
```bash
# Ver logs en tiempo real
railway logs -f

# Ejecutar comando en Railway
railway run [comando]

# Ver estado
railway status

# Abrir app en navegador
railway open
```

---

## 📊 TIEMPO ESTIMADO POR PASO

| Paso | Tiempo | Dificultad |
|------|--------|------------|
| 1. Git push | 1 min | ⭐ |
| 2. Abrir Railway | 1 min | ⭐ |
| 3. Obtener URL | 1 min | ⭐ |
| 4. Variables | 5 min | ⭐⭐ |
| 5. AUTH_SECRET | 2 min | ⭐⭐ |
| 6. Deploy | 5-10 min | ⭐ |
| 7. Verificar | 2 min | ⭐ |
| 8. Migraciones | 3 min | ⭐⭐ |
| 9. Crear admin | 3 min | ⭐⭐ |
| 10. Probar | 5 min | ⭐ |

**Total: 30-40 minutos**

---

**¡Éxito!** 🚀

Después de completar estos pasos, tu e-commerce IZA&CAS estará 100% funcional en Railway.
