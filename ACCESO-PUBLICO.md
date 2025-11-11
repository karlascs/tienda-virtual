# Guía de Acceso Público - IZA&CAS E-commerce

## 🌐 Páginas Públicas (Sin login requerido)

Los clientes pueden navegar libremente por estas páginas sin necesidad de registrarse:

### ✅ Acceso Total Público

1. **Página Principal** (`/`)
   - Banner promocional
   - Categorías de productos
   - Productos destacados
   - Recomendaciones personalizadas
   - Productos populares

2. **Catálogo de Productos** (`/products/*`)
   - `/products/tecnologia`
   - `/products/electrohogar`
   - `/products/herramientas`
   - `/products/hogar`
   - `/products/actividad`
   - `/products/cuidadopersonal`
   - `/products/juguetes`

3. **Detalle de Producto** (`/products/[category]/[id]`)
   - Ver información completa del producto
   - Imágenes, descripción, precio
   - Agregar al carrito
   - Agregar a wishlist (lista de deseos)

4. **Carrito de Compras** (`/cart`)
   - Ver productos agregados
   - Modificar cantidades
   - **Comprar como invitado** (sin registrarse)
   - Checkout completo disponible

5. **Lista de Deseos** (`/wishlist`)
   - Ver productos guardados
   - Agregar al carrito desde wishlist
   - No requiere login

6. **Registro** (`/register`)
   - Crear cuenta nueva

7. **Inicio de Sesión** (`/login`)
   - Iniciar sesión en cuenta existente

## 🔒 Páginas Protegidas (Requieren login)

### Usuario Registrado

1. **Perfil** (`/profile`)
   - Información personal
   - Historial de compras
   - Configuración de cuenta

2. **Mis Pedidos** (`/orders`)
   - Ver órdenes realizadas
   - Estado de envíos
   - Detalles de compras

### Administrador (ADMIN role)

3. **Panel de Administración** (`/admin`)
   - Dashboard de ventas
   - Gestión de productos
   - Gestión de categorías
   - Gestión de banners
   - Gestión de inventario
   - Gestión de pedidos
   - Reportes y análisis

## 💡 Funcionalidades para Invitados

Los clientes **NO registrados** pueden:

✅ Navegar por todas las categorías
✅ Ver productos y sus detalles
✅ Agregar productos al carrito
✅ Agregar productos a la lista de deseos
✅ Ver comparación de productos
✅ **Completar compras como invitado**
✅ Realizar pagos con Webpay
✅ Recibir confirmación de pedido por email

## 🛒 Checkout como Invitado

Los invitados proporcionan:
- ✅ Nombre completo
- ✅ Email
- ✅ Teléfono
- ✅ RUT (para facturación)
- ✅ Dirección de envío completa
- ✅ Región y comuna

**No necesitan:**
- ❌ Crear cuenta
- ❌ Contraseña
- ❌ Recordar login

## 📊 Ventajas de Registrarse

Para los clientes, crear una cuenta les permite:

1. **Historial de Compras**
   - Ver todas sus órdenes
   - Rastrear envíos
   - Reimprimir facturas

2. **Checkout Rápido**
   - Datos pre-llenados
   - Múltiples direcciones guardadas
   - No re-ingresar información

3. **Wishlist Persistente**
   - Lista de deseos guardada
   - Acceso desde cualquier dispositivo

4. **Recomendaciones Personalizadas**
   - Productos sugeridos según historial
   - Ofertas personalizadas

5. **Soporte Prioritario**
   - Seguimiento de pedidos más rápido
   - Historial de conversaciones

## 🔐 Seguridad

### Para Invitados
- ✅ Datos encriptados en tránsito (HTTPS)
- ✅ No se almacena información de tarjetas
- ✅ Pago seguro con Transbank
- ✅ Validación de RUT chileno

### Para Usuarios Registrados
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Sesiones con JWT
- ✅ Autenticación con NextAuth.js v5
- ✅ Rate limiting para prevenir ataques

## 🚀 Cómo Probar el Sitio

### Modo Invitado
1. Visita `http://localhost:3000`
2. Navega por las categorías
3. Agrega productos al carrito
4. Completa el checkout sin registrarte

### Modo Usuario Registrado
1. Crea una cuenta en `/register`
2. Inicia sesión en `/login`
3. Disfruta de las ventajas adicionales

### Modo Administrador
1. Inicia sesión con:
   - Email: `admin@izacas.com`
   - Contraseña: `Admin123!`
2. Accede al panel en `/admin`

## 📱 Responsive

Todas las páginas públicas son completamente responsive:
- ✅ Desktop (>1024px)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (< 768px)

## 🎨 Personalización

Los clientes pueden:
- Ver productos en modo lista o grid
- Filtrar por precio, categoría, marca
- Ordenar por precio, popularidad, novedad
- Comparar hasta 4 productos
- Ver productos recientemente vistos

---

## ✨ Resumen

**El 95% del sitio es público y navegable sin login**

Solo necesitan registrarse si quieren:
- Ver historial de pedidos
- Guardar direcciones
- Tener checkout más rápido

**Para comprar: NO ES NECESARIO REGISTRARSE** ✅
