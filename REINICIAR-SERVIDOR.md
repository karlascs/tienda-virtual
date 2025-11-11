# 🔄 Pasos para Completar la Instalación

## ⚠️ Importante: Reiniciar Servidor

El servidor de desarrollo debe reiniciarse para que Prisma reconozca los nuevos campos de la base de datos.

### Cambios Aplicados:
✅ Checkout como invitado (sin registro)
✅ Validación completa (RUT, email, teléfono)
✅ Código postal eliminado (no requerido)
✅ Google Maps autocomplete integrado
✅ Base de datos actualizada

### Paso 1: Detener el Servidor

En la terminal donde corre `npm run dev`:
```bash
Ctrl + C
```

### Paso 2: Regenerar Cliente de Prisma

```bash
cd "c:\Users\Karla\Desktop\proyecto fron end\tienda-next"
npx prisma generate
```

### Paso 3: Reiniciar Servidor

```bash
npm run dev
```

### Paso 4: Probar el Checkout

1. Ir a http://localhost:3000/cart
2. Agregar productos
3. Completar formulario de checkout
4. Click en "Ir a Pagar con Webpay"

---

## ✅ Verificación

### Si todo funciona correctamente:

✅ No hay errores de compilación de TypeScript
✅ El formulario de checkout se muestra completo
✅ Validaciones funcionan (RUT, email, teléfono)
✅ Botón se habilita cuando todo está completo
✅ Checkout procesa correctamente

### Si hay errores:

**Error: "isGuest no existe"**
```bash
# Solución:
npx prisma generate
npm run dev
```

**Error: "shippingRut no existe"**
```bash
# Solución:
npx prisma migrate dev
npx prisma generate
npm run dev
```

**Error: "Google Maps no carga"**
```bash
# Normal si no has configurado API key
# El formulario funciona igual sin autocompletar
```

---

## 📋 Checklist Post-Instalación

- [ ] Servidor detenido (Ctrl + C)
- [ ] Prisma generado (`npx prisma generate`)
- [ ] Servidor reiniciado (`npm run dev`)
- [ ] Página del carrito carga sin errores
- [ ] Formulario de checkout visible
- [ ] Validaciones funcionando
- [ ] Checkout procesa correctamente

---

## 🧪 Prueba Rápida

```bash
1. Ir a: http://localhost:3000/cart
2. Completar formulario:
   Nombre: Test Usuario
   Email: test@test.cl  
   RUT: 11111111-1
   Teléfono: +56912345678
   Dirección: Av. Test 123
   Ciudad: Santiago
   Región: Región Metropolitana
   Código: 8320000
3. Verificar que botón se habilita
4. Click "Ir a Pagar con Webpay"
5. Usar tarjeta: 4051 8856 0044 6623
```

---

## 📚 Documentación

- `CHECKOUT-INVITADO-RESUMEN.md` - Resumen completo
- `GOOGLE-MAPS-SETUP.md` - Configurar Google Maps
- `GUIA-CHECKOUT-WEBPAY.md` - Guía de uso Webpay

---

**Estado actual:** ⏳ Pendiente reinicio de servidor
**Próximo paso:** Detener servidor → `npx prisma generate` → Reiniciar
