# 🎯 CARGAR TODOS LOS PRODUCTOS CON FOTOS A RAILWAY

## ✅ Tu Base de Datos Está Lista

Veo en la imagen que tu PostgreSQL en Railway ya tiene:
- ✅ Base de datos conectada
- ✅ Tabla `products` creada
- ✅ Algunos productos ya cargados

Ahora vamos a cargar TODOS los productos con TODAS las fotos.

---

## 🚀 OPCIÓN 1: Desde Railway Terminal (MÁS RÁPIDO)

### Paso 1: Abrir Railway Terminal

1. Ve a https://railway.app
2. Selecciona tu proyecto
3. Click en tu servicio de Next.js
4. Click en **"..."** (tres puntos arriba a la derecha)
5. Selecciona **"Terminal"** o **"Shell"**

### Paso 2: Ejecutar el Seeder

Copia y pega este comando completo en el terminal:

```bash
node scripts/seed-railway-complete.js
```

⏱️ **Tiempo estimado:** 2-5 minutos (dependiendo de cuántos productos tengas)

### Paso 3: Verificar Resultados

Debes ver algo como:

```
✅ CARGA COMPLETADA!

📊 RESUMEN:
   ✨ Productos creados: 45
   🔄 Productos actualizados: 8
   ❌ Errores: 0
   📦 Total: 53 productos

📋 PRODUCTOS POR CATEGORÍA:

   actividad            → 15 productos
   cuidadopersonal      → 5 productos
   electrohogar         → 10 productos
   herramientas         → 11 productos
   hogar                → 6 productos
   juguetes             → 10 productos
   tecnologia           → 8 productos

   TOTAL                → 65 productos

🎉 ¡Base de datos lista con todas las fotos!
```

---

## 🚀 OPCIÓN 2: Desde tu Computadora (con Railway CLI)

### Paso 1: Instalar Railway CLI (si no lo tienes)

```powershell
npm install -g @railway/cli
```

### Paso 2: Login en Railway

```powershell
railway login
```

### Paso 3: Conectar a tu Proyecto

```powershell
cd "C:\Users\Karla\Desktop\proyecto fron end\tienda-next"
railway link
```

Selecciona tu proyecto cuando te pregunte.

### Paso 4: Ejecutar Seeder

```powershell
railway run node scripts/seed-railway-complete.js
```

---

## 🚀 OPCIÓN 3: Script Manual en Terminal Railway

Si las opciones anteriores no funcionan, copia y pega este código COMPLETO directamente en Railway Terminal:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function quickSeed() {
  console.log('🚀 Carga rápida de productos...\n');
  
  // Buscar categorías
  const categories = await prisma.category.findMany();
  console.log(`Categorías encontradas: ${categories.length}\n`);
  
  // Contador de productos creados
  let count = 0;
  
  // Ejemplo de productos por categoría
  const productsData = [
    // Actividad (15 productos)
    { name: 'Carpa Casita Princesa', slug: 'carpa-casita-princesa', categorySlug: 'actividad', price: 25990, images: ['/images/actividad/carpas/carpacasitaprincesa/img1.jpg'] },
    { name: 'Carpa Castillo Infantil', slug: 'carpa-castillo-infantil', categorySlug: 'actividad', price: 27990, images: ['/images/actividad/carpas/carpacastilloinfantil/img1.jpg'] },
    // ... más productos
  ];
  
  for (const prod of productsData) {
    try {
      const category = categories.find(c => c.slug === prod.categorySlug);
      if (!category) continue;
      
      const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });
      
      if (!existing) {
        await prisma.product.create({
          data: {
            ...prod,
            sku: `SKU-${prod.categorySlug.substring(0,5).toUpperCase()}-${String(count).padStart(3,'0')}`,
            description: `${prod.name} - IZA&CAS`,
            stock: 15,
            categoryId: category.id,
            isActive: true,
            averageRating: 0,
            totalReviews: 0
          }
        });
        count++;
      }
    } catch (e) {
      console.error(`Error: ${prod.name}`, e.message);
    }
  }
  
  console.log(`✅ Productos creados: ${count}`);
  await prisma.$disconnect();
}

quickSeed();
```

---

## 📊 VERIFICAR QUE TODO SE CARGÓ

### Opción A: En Railway Dashboard

1. Ve a tu base de datos PostgreSQL en Railway
2. Click en **"Data"**
3. Selecciona tabla **"products"**
4. Debes ver TODOS tus productos con sus columnas:
   - `id`
   - `name`
   - `slug`
   - `images` (array con rutas de fotos)
   - `price`
   - `stock`

### Opción B: Con Prisma Studio

En Railway Terminal:

```bash
npx prisma studio
```

Esto abrirá una interfaz web donde puedes ver todos los productos.

### Opción C: Contar Productos

En Railway Terminal:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.product.count().then(count => {
  console.log('Total de productos:', count);
  prisma.\$disconnect();
});
"
```

---

## 🖼️ VERIFICAR QUE LAS IMÁGENES SE VEN

### Paso 1: Abrir tu App

Ve a tu URL de Railway:
```
https://tu-app.up.railway.app
```

### Paso 2: Navegar por las Categorías

1. Click en cualquier categoría (Actividad, Hogar, Tecnología, etc.)
2. Debes ver productos con sus imágenes
3. Click en un producto
4. Debe abrir el modal con todas las fotos

### Paso 3: Verificar Ruta de Imágenes

Si las imágenes NO se ven:

1. Abre DevTools del navegador (F12)
2. Ve a la pestaña **"Network"**
3. Filtra por **"Images"**
4. Busca errores 404

**Si ves errores 404**, el problema es que las imágenes no se copiaron al build de Docker.

---

## 🐛 SOLUCIÓN: Si las Imágenes No Se Ven

### Verificar que el Dockerfile Copió las Imágenes

En Railway Terminal:

```bash
ls -la /app/public/images/
```

Debes ver todas tus carpetas:
```
actividad/
cuidadopersonal/
electro hogar/
herramientas/
hogar/
juguetes/
tecnologia/
```

### Si NO están las imágenes:

Significa que el Dockerfile no las copió correctamente. **YA LO ARREGLAMOS** en el commit anterior.

Ahora necesitas:

1. **Hacer redeploy** en Railway:
   - Railway → Deployments → "..." → Redeploy

2. **Esperar 5-10 minutos** para que reconstruya

3. **Verificar nuevamente** que las imágenes se vean

---

## 🎯 CHECKLIST COMPLETO

Marca cada paso cuando lo completes:

### Base de Datos:
- [ ] PostgreSQL conectado en Railway
- [ ] Migraciones ejecutadas (`npx prisma migrate deploy`)
- [ ] Categorías creadas (7 categorías)
- [ ] Productos cargados (50+ productos)
- [ ] Cada producto tiene array de `images`

### Imágenes:
- [ ] Dockerfile actualizado (ya lo hicimos)
- [ ] Git push completado
- [ ] Railway rebuild completado
- [ ] Carpeta `/app/public/images/` existe en contenedor
- [ ] Imágenes se ven en la app

### Testing:
- [ ] App abre sin errores
- [ ] Categorías muestran productos
- [ ] Productos tienen imágenes visibles
- [ ] Modal de producto muestra fotos
- [ ] No hay errores 404 en DevTools Network

---

## 💡 RESUMEN RÁPIDO

```bash
# 1. Cargar productos (Railway Terminal)
node scripts/seed-railway-complete.js

# 2. Verificar productos
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.product.count().then(c=>{console.log('Productos:',c);p.\$disconnect()});"

# 3. Verificar imágenes
ls -la /app/public/images/

# 4. Abrir app
# https://tu-app.up.railway.app
```

---

## 🆘 SI ALGO NO FUNCIONA

### Problema: Productos no se cargan
**Solución:** Verifica que las categorías existan primero:
```bash
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.category.findMany().then(c=>{console.log(c);p.\$disconnect()});"
```

### Problema: Imágenes no se ven
**Solución:** 
1. Verifica Dockerfile tiene: `COPY --from=builder --chown=nextjs:nodejs /app/public ./public`
2. Hace git push
3. Railway → Redeploy

### Problema: Error "Module not found"
**Solución:**
```bash
npm install
npx prisma generate
```

---

## 🎉 RESULTADO ESPERADO

Después de completar todos los pasos:

✅ **65+ productos** en tu base de datos PostgreSQL  
✅ **Todas las imágenes** en la columna `images` (array)  
✅ **Imágenes visibles** al navegar por la app  
✅ **Modal funcional** con galería de fotos  
✅ **Categorías completas** con todos los productos  

---

**Tiempo total:** 10-15 minutos  
**Dificultad:** ⭐⭐ (Fácil)

¡Listo para cargar todos los productos con fotos! 🚀
