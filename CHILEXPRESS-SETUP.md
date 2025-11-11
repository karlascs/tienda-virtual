# Guía de Configuración Chilexpress

## 📦 Integración con Chilexpress

Esta guía te ayudará a configurar la integración con Chilexpress para calcular automáticamente los costos de envío.

## 1. Registro en Chilexpress Developers

### Paso 1: Crear cuenta
1. Ve a [https://developers.chilexpress.cl/](https://developers.chilexpress.cl/)
2. Haz clic en "Registrarse"
3. Completa el formulario con tus datos
4. Verifica tu email

### Paso 2: Obtener credenciales
1. Inicia sesión en el portal de desarrolladores
2. Ve a "API Keys" o "Credenciales"
3. Crea una nueva aplicación
4. Copia tu `API Key` y `API Secret`

## 2. Configuración en el Proyecto

### Paso 1: Actualizar .env
Abre el archivo `.env` y agrega tus credenciales:

```env
# CHILEXPRESS API
CHILEXPRESS_API_KEY="tu_api_key_real_aqui"
CHILEXPRESS_API_SECRET="tu_api_secret_real_aqui"
CHILEXPRESS_ENV="sandbox"

# Dirección de tu tienda (origen de los envíos)
CHILEXPRESS_ORIGIN_STREET="Tu calle"
CHILEXPRESS_ORIGIN_NUMBER="123"
CHILEXPRESS_ORIGIN_COMMUNE="Viña del Mar"
CHILEXPRESS_ORIGIN_CITY="Viña del Mar"
CHILEXPRESS_ORIGIN_REGION="Valparaíso"
CHILEXPRESS_ORIGIN_POSTAL="2520000"
```

### Paso 2: Configurar dirección de origen
Actualiza la configuración en `src/lib/chilexpress.ts`:

```typescript
export const CHILEXPRESS_CONFIG = {
  defaultOrigin: {
    streetName: process.env.CHILEXPRESS_ORIGIN_STREET || 'Tu calle',
    streetNumber: process.env.CHILEXPRESS_ORIGIN_NUMBER || '123',
    commune: process.env.CHILEXPRESS_ORIGIN_COMMUNE || 'Viña del Mar',
    city: process.env.CHILEXPRESS_ORIGIN_CITY || 'Viña del Mar',
    region: process.env.CHILEXPRESS_ORIGIN_REGION || 'Valparaíso',
    postalCode: process.env.CHILEXPRESS_ORIGIN_POSTAL || '2520000',
  },
  // ...
};
```

## 3. Uso de la API

### Cotizar envío

```typescript
// POST /api/shipping/quote
const response = await fetch('/api/shipping/quote', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    commune: 'Santiago',
    city: 'Santiago',
    region: 'Región Metropolitana',
    items: [
      {
        weight: 1.5, // kg
        quantity: 2
      }
    ],
    totalValue: 50000
  })
});

const data = await response.json();
// data.quotes contiene las opciones de envío con precios
```

### Respuesta esperada

```json
{
  "success": true,
  "quotes": [
    {
      "service": "Express",
      "code": "EXPRESS",
      "price": 5990,
      "estimatedDays": 1,
      "carrier": "Chilexpress"
    },
    {
      "service": "Normal",
      "code": "NORMAL",
      "price": 3990,
      "estimatedDays": 3,
      "carrier": "Chilexpress"
    }
  ]
}
```

## 4. Integración en el Checkout

### Modificar GuestCheckoutForm

Actualiza `src/components/GuestCheckoutForm.tsx` para:

1. Llamar a la API de cotización cuando se seleccione la región
2. Mostrar las opciones de envío al usuario
3. Incluir el costo de envío en el total

```typescript
const [shippingOptions, setShippingOptions] = useState([]);
const [selectedShipping, setSelectedShipping] = useState(null);

const fetchShippingQuotes = async () => {
  const response = await fetch('/api/shipping/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      commune: formData.city,
      city: formData.city,
      region: formData.region,
      totalValue: cartTotal
    })
  });
  
  const data = await response.json();
  setShippingOptions(data.quotes);
};
```

## 5. Testing

### Modo Sandbox
En modo sandbox puedes usar datos de prueba:

- **Región**: Cualquier región de Chile
- **Comuna**: Cualquier comuna válida
- **Peso**: Entre 0.5 kg y 50 kg

### Comandos de prueba

```bash
# Probar cotización
curl -X POST http://localhost:3000/api/shipping/quote \
  -H "Content-Type: application/json" \
  -d '{
    "commune": "Santiago",
    "city": "Santiago",
    "region": "Región Metropolitana",
    "totalValue": 50000
  }'
```

## 6. Producción

### Checklist antes de pasar a producción:

- [ ] Obtener credenciales de producción de Chilexpress
- [ ] Actualizar `.env` con credenciales reales
- [ ] Cambiar `CHILEXPRESS_ENV="production"`
- [ ] Configurar correctamente la dirección de origen
- [ ] Probar con direcciones reales
- [ ] Implementar manejo de errores robusto
- [ ] Agregar logs de auditoría

### Cambios necesarios en .env:

```env
CHILEXPRESS_API_KEY="prod_api_key"
CHILEXPRESS_API_SECRET="prod_api_secret"
CHILEXPRESS_ENV="production"
```

## 7. Funcionalidades Adicionales

### Crear envío real
Después de confirmar el pago, puedes crear el envío:

```typescript
const shipment = await chilexpress.createShipment(
  origin,
  destination,
  packages,
  selectedServiceCode,
  orderNumber
);
// shipment.trackingNumber - para rastreo
// shipment.label - etiqueta de envío
```

### Rastrear envío
```typescript
const tracking = await chilexpress.trackShipment(trackingNumber);
```

## 8. Fallback

Si la API de Chilexpress no está disponible, el sistema automáticamente usa:
- Precio fijo: $3,000 CLP
- Envío gratis sobre $30,000 CLP

## 9. Soporte

- **Documentación Chilexpress**: https://developers.chilexpress.cl/docs
- **Soporte técnico**: soporte@chilexpress.cl
- **FAQ**: https://developers.chilexpress.cl/faq

## 10. Regiones de Chile

Las 16 regiones disponibles:
1. Arica y Parinacota
2. Tarapacá
3. Antofagasta
4. Atacama
5. Coquimbo
6. Valparaíso
7. Región Metropolitana
8. O'Higgins
9. Maule
10. Ñuble
11. Biobío
12. Araucanía
13. Los Ríos
14. Los Lagos
15. Aysén
16. Magallanes

---

## Problemas Comunes

### Error: "Invalid API Key"
- Verifica que las credenciales estén correctas en `.env`
- Asegúrate de estar usando las credenciales del ambiente correcto (sandbox/production)

### Error: "Region not found"
- Usa los nombres exactos de las regiones chilenas
- Verifica que la comuna pertenezca a la región seleccionada

### Precio de envío muy alto
- Revisa el peso y dimensiones de los paquetes
- Confirma la dirección de destino
- Verifica que el valor declarado sea correcto
