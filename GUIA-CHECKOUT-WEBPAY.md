# 🛒 Guía de Uso - Checkout con Webpay Plus

## 📋 Requisitos para Procesar un Pago

### 1. Usuario debe estar autenticado
El sistema requiere que el usuario inicie sesión antes de proceder al pago.

**Si no está autenticado:**
- El botón mostrará: "🔐 Iniciar Sesión para Pagar"
- Al hacer clic, será redirigido a `/login?callbackUrl=/cart`
- Después de iniciar sesión, volverá al carrito automáticamente

### 2. Completar dirección de envío
Todos los campos son obligatorios:
- ✅ Calle y número
- ✅ Ciudad
- ✅ Región (selector con 16 regiones de Chile)
- ✅ Código postal

**El botón se habilita automáticamente** cuando todos los campos están completos.

---

## 🔄 Flujo Completo del Checkout

### Paso 1: Preparar el Carrito
```
Usuario agrega productos → Carrito con items
```

### Paso 2: Iniciar Sesión
```
Si no está autenticado → Click en botón → Redirige a /login
Usuario inicia sesión → Vuelve al carrito
```

### Paso 3: Completar Dirección
```
Llenar formulario de envío:
- Calle: "Av. Libertador 1234, Depto 501"
- Ciudad: "Santiago"
- Región: "Región Metropolitana"
- Código Postal: "8320000"
```

### Paso 4: Procesar Pago
```
Click en "🛒 Ir a Pagar con Webpay"
↓
Sistema valida datos
↓
Crea orden en estado PENDING
↓
Genera transacción con Transbank
↓
Redirige a página de Webpay
```

### Paso 5: Pagar en Webpay
```
Usuario completa pago en sitio de Transbank
↓
Transbank procesa tarjeta
↓
Redirige a /checkout/return?token_ws=XXXXX
```

### Paso 6: Confirmación
```
Sistema confirma pago con Transbank
↓
Actualiza orden a CONFIRMED
↓
Actualiza stock de productos
↓
Crea movimientos de inventario
↓
Redirige a /checkout/success
```

---

## 🧪 Tarjetas de Prueba (Ambiente de Integración)

### ✅ Tarjeta Aprobada
```
Número: 4051 8856 0044 6623
CVV: 123
Fecha: Cualquier fecha futura
```

### ❌ Tarjeta Rechazada
```
Número: 4051 8860 0005 6590
CVV: 123
Fecha: Cualquier fecha futura
```

---

## 🔍 Verificar Estado del Sistema

### Verificar Autenticación
Abrir consola del navegador:
```javascript
// En la página del carrito
console.log('Sesión:', document.querySelector('[data-session]'))
```

### Verificar Dirección Completa
El botón debe decir:
- ❌ Si campos incompletos: Botón deshabilitado (gris)
- ✅ Si campos completos: "🛒 Ir a Pagar con Webpay" (morado)

### Verificar API
```bash
# Ver logs del servidor Next.js
npm run dev
```

Deberías ver en la terminal:
```
POST /api/checkout/create 200
POST /api/checkout/confirm 200
```

---

## 🐛 Solución de Problemas

### "No se puede usar el botón"
**Causa**: Usuario no autenticado
**Solución**: 
1. Iniciar sesión
2. Volver al carrito
3. Completar dirección
4. Intentar de nuevo

### "Datos de envío incompletos"
**Causa**: Faltan campos en el formulario
**Solución**: Completar todos los campos de dirección

### "Stock insuficiente"
**Causa**: No hay suficiente stock del producto
**Solución**: 
1. Reducir cantidad en el carrito
2. O agregar stock en el admin

### "No autorizado. Debes iniciar sesión"
**Causa**: Sesión expiró o no existe
**Solución**: Cerrar sesión e iniciar sesión nuevamente

### "Error al procesar el pago"
**Causa**: Error de conexión con Transbank
**Solución**: 
1. Verificar variables de entorno en `.env`
2. Verificar que `TRANSBANK_COMMERCE_CODE` y `TRANSBANK_API_KEY` son correctos
3. Revisar logs del servidor

---

## 📊 Cálculos Automáticos

### Subtotal
```
Suma de (precio × cantidad) de cada item
```

### IVA (19%)
```
IVA = Subtotal × 0.19
```

### Envío
```
Si Subtotal >= $30.000 → Envío GRATIS
Si Subtotal < $30.000 → Envío $3.000
```

### Total
```
Total = Subtotal + IVA + Envío
```

### Ejemplo:
```
Producto A: $10.000 × 2 = $20.000
Producto B: $15.000 × 1 = $15.000
───────────────────────────────
Subtotal:           $35.000
IVA (19%):          $ 6.650
Envío (gratis):     $     0
───────────────────────────────
TOTAL:              $41.650
```

---

## 🔐 Seguridad Implementada

✅ Rate limiting en APIs (20 requests/min)
✅ Autenticación obligatoria con NextAuth.js
✅ Validación de stock antes de procesar
✅ Tokens seguros de Transbank
✅ HTTPS requerido en producción
✅ Headers de seguridad HTTP

---

## 🚀 Pasar a Producción

### 1. Obtener credenciales reales de Transbank
Registrarse en: https://www.transbankdevelopers.cl/

### 2. Actualizar `.env`
```bash
TRANSBANK_COMMERCE_CODE="tu_codigo_comercio_real"
TRANSBANK_API_KEY="tu_api_key_produccion_real"
TRANSBANK_ENVIRONMENT="production"
TRANSBANK_RETURN_URL="https://tudominio.cl/checkout/return"
TRANSBANK_FINAL_URL="https://tudominio.cl/checkout/success"
```

### 3. Configurar HTTPS
Transbank **requiere HTTPS** en producción.

### 4. Probar con tarjetas reales
Usar tarjetas de crédito/débito reales en ambiente de producción.

---

## 📞 Soporte

### Documentación Transbank
https://www.transbankdevelopers.cl/documentacion/webpay-plus

### Errores Comunes Transbank
https://www.transbankdevelopers.cl/documentacion/como-empezar#codigos-de-respuesta

### Logs del Sistema
```bash
# Terminal del servidor
npm run dev

# Ver errores en navegador
F12 → Console
```

---

**Última actualización:** 10 de noviembre de 2025
**Versión:** 1.0.0
**Ambiente:** Integración (Testing)
