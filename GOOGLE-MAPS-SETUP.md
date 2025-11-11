# 🗺️ Configuración de Google Maps API

## 📝 Obtener API Key de Google Maps

### Paso 1: Crear Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Click en "Crear Proyecto" (esquina superior)
4. Nombre del proyecto: `IZA-CAS-Ecommerce`
5. Click en "Crear"

### Paso 2: Habilitar Places API

1. En el menú lateral, ve a **APIs y servicios > Biblioteca**
2. Busca: `Places API`
3. Click en **Places API**
4. Click en **HABILITAR**

### Paso 3: Crear Credenciales

1. Ve a **APIs y servicios > Credenciales**
2. Click en **+ CREAR CREDENCIALES**
3. Selecciona **Clave de API**
4. Copia la clave generada

### Paso 4: Restringir API Key (Importante)

1. Click en el ícono de lápiz junto a tu nueva clave
2. En "Restricciones de aplicación":
   - Selecciona **Sitios web**
   - Agrega: 
     - `http://localhost:3000/*`
     - `https://tudominio.cl/*` (cuando tengas tu dominio)
3. En "Restricciones de API":
   - Selecciona **Restringir clave**
   - Marca: **Places API**
4. Click en **GUARDAR**

### Paso 5: Configurar en tu Proyecto

Abre el archivo `.env` y agrega:

```bash
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="TU_API_KEY_AQUI"
```

**Importante:** El prefijo `NEXT_PUBLIC_` permite que la clave sea accesible en el navegador (necesario para Google Maps).

---

## 💰 Precios y Límites

### Plan Gratuito
- ✅ $200 USD de crédito mensual gratis
- ✅ ~28,000 solicitudes de autocompletar por mes
- ✅ Suficiente para sitios pequeños/medianos

### Costo por Solicitud
- **Autocomplete**: $2.83 USD por 1,000 solicitudes
- **Places Details**: $17 USD por 1,000 solicitudes

### Ejemplo de Uso:
Si tu tienda recibe 1,000 checkouts al mes:
- 1,000 autocompletados × $0.00283 = **$2.83 USD/mes**
- Cubierto por el crédito gratuito de $200

---

## 🔐 Seguridad

### ✅ Hacer:
1. **Siempre** restringir la API key por dominio
2. **Nunca** subir `.env` a Git (ya está en `.gitignore`)
3. Usar claves diferentes para desarrollo y producción
4. Monitorear uso en Google Cloud Console

### ❌ No Hacer:
1. No compartir la API key públicamente
2. No dejar la key sin restricciones
3. No usar la misma key en múltiples proyectos

---

## 🧪 Modo de Prueba (Sin API Key)

Si aún no tienes API key, el formulario funciona pero sin autocompletar:
- Usuarios deben escribir la dirección completa manualmente
- Todas las validaciones siguen funcionando
- El checkout procesa normalmente

---

## 🌐 Alternativas a Google Maps

Si prefieres no usar Google Maps:

### Opción 1: Mapbox
- Similar a Google Maps
- $0.50 por 1,000 solicitudes
- 100,000 solicitudes gratis por mes
- Web: https://www.mapbox.com/

### Opción 2: OpenStreetMap (Nominatim)
- Completamente gratuito y open source
- Sin límites de uso para autohosting
- Requiere configuración de servidor
- Web: https://nominatim.org/

### Opción 3: Sin Autocompletar (Actual)
- Formulario manual tradicional
- 100% gratis
- Requiere que usuarios escriban todo
- Funciona perfectamente

---

## 📊 Monitorear Uso

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Menú lateral → **APIs y servicios** → **Panel**
3. Verás gráfico de solicitudes diarias
4. Configura alertas si superas $50 USD/mes

---

## 🚀 Implementación en el Código

El componente `GuestCheckoutForm.tsx` ya está configurado para usar Google Maps.

### Con API Key:
```tsx
<Script
  src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
  onLoad={initAutocomplete}
/>
```

### Sin API Key:
El formulario funciona normalmente como formulario manual estándar.

---

## ✅ Checklist de Configuración

- [ ] Crear proyecto en Google Cloud
- [ ] Habilitar Places API
- [ ] Generar API Key
- [ ] Restringir key por dominio
- [ ] Agregar key a `.env`
- [ ] Verificar `.env` en `.gitignore`
- [ ] Probar autocompletar en localhost
- [ ] Configurar alertas de facturación

---

## 🆘 Solución de Problemas

### "Esta API Key no está autorizada"
**Solución:** Verifica restricciones de dominio en Google Cloud Console

### "You have exceeded your daily request quota"
**Solución:** 
1. Revisa uso en Console
2. Aumenta límite o optimiza solicitudes
3. Considera plan de pago

### Autocompletar no funciona
**Solución:**
1. Abre DevTools (F12) → Console
2. Busca errores de Google Maps
3. Verifica que API Key esté en `.env`
4. Verifica que Places API esté habilitada

---

**Última actualización:** 10 de noviembre de 2025
**Versión:** 1.0.0
