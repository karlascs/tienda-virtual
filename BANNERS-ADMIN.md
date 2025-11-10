# 🎨 Gestión de Banners - IZA&CAS

## ✅ Funcionalidad Implementada Completamente

Ahora puedes gestionar los banners del carousel de la página principal desde el panel de administración.

## 📍 Acceso al Panel de Banners

1. Navega a: **http://localhost:3000/admin/banners**
2. O desde el panel admin: **Sidebar → Banners (🎨)**

## 🎯 Funcionalidades Disponibles

### 1. **Ver Banners Actuales**
- Lista visual de todos los banners con previsualizaciones
- Indica el orden de visualización
- Estado activo/inactivo de cada banner

### 2. **Crear Nuevo Banner**
- Click en "**+ Nuevo Banner**"
- Campos requeridos:
  - **Título**: Nombre del banner
  - **URL de Imagen**: Ruta de la imagen (ej: `/bannerIZAyCAS.png`)
- Campos opcionales:
  - **Subtítulo**: Texto secundario
  - **Enlace**: URL a donde redirigir al hacer click (ej: `/products/tecnologia`)

### 3. **Editar Banner Existente**
- Click en "✏️ Editar" en cualquier banner
- Modifica los campos necesarios
- Click en "Actualizar"

### 4. **Reordenar Banners (Drag & Drop)**
- Arrastra los banners usando el ícono **⋮⋮** (esquina superior izquierda)
- Suelta en la nueva posición
- El orden se actualiza automáticamente
- Los banners se mostrarán en la página principal según este orden

### 5. **Activar/Desactivar Banners**
- Click en el badge "**✓ Activo**" o "**✕ Inactivo**"
- Solo los banners activos se muestran en la página principal
- Los inactivos se guardan pero no se visualizan

### 6. **Eliminar Banner**
- Click en "🗑️ Eliminar"
- Confirma la acción
- El banner se elimina permanentemente

## 🖼️ Cómo Agregar Imágenes de Banner

### Opción 1: Imágenes Locales
1. Coloca tu imagen en la carpeta `public/` del proyecto
   ```
   tienda-next/
   └── public/
       ├── bannerIZAyCAS.png
       ├── banner-navidad.png
       └── tu-nuevo-banner.jpg
   ```

2. En el formulario de banner, usa la ruta relativa:
   ```
   /banner-navidad.png
   /tu-nuevo-banner.jpg
   ```

### Opción 2: URLs Externas
- Puedes usar URLs completas de imágenes alojadas en otros servidores:
  ```
  https://ejemplo.com/imagen-banner.jpg
  ```

## 💡 Casos de Uso

### Promoción Temporal
```
Título: ¡Black Friday!
Subtítulo: Hasta 70% de descuento
Imagen: /banner-black-friday.png
Enlace: /products/ofertas
Estado: ✓ Activo
```

### Banner Informativo
```
Título: Envío Gratis
Subtítulo: En compras mayores a $50
Imagen: /banner-envio-gratis.png
Enlace: (vacío - no clickeable)
Estado: ✓ Activo
```

### Categoría Destacada
```
Título: Nuevos en Tecnología
Subtítulo: Descubre lo último en gadgets
Imagen: /banner-tecnologia.png
Enlace: /products/tecnologia
Estado: ✓ Activo
```

## 🔄 Cómo Funciona el Carousel

1. **Automático**: Los banners cambian cada 5 segundos
2. **Manual**: Los usuarios pueden navegar con las flechas ← →
3. **Indicadores**: Puntos en la parte inferior muestran cuántos banners hay
4. **Responsive**: Se adapta a móviles, tablets y desktop

## 📊 Ejemplo de Flujo de Trabajo

### Campaña Navideña
1. **Noviembre**: Creas banner de Navidad
   - Lo dejas inactivo (✕ Inactivo)
   
2. **1 de Diciembre**: Activas el banner navideño
   - Click en el badge para cambiar a (✓ Activo)
   
3. **Durante Diciembre**: El banner se muestra en el carousel
   
4. **26 de Diciembre**: Desactivas el banner
   - Click nuevamente en el badge → (✕ Inactivo)
   
5. **Enero**: Eliminas o guardas para el próximo año

## 🎨 Recomendaciones de Diseño

### Tamaño de Imagen Ideal
- **Ancho**: 1200px - 1600px
- **Alto**: 300px - 500px
- **Formato**: JPG o PNG
- **Peso**: Menos de 500KB para carga rápida

### Proporciones
- Desktop: 16:5 (landscape amplio)
- Móvil: Se adapta automáticamente

### Contenido Visual
- Texto grande y legible
- Colores que contrasten con el fondo
- Call-to-action visible
- Evita saturar con mucho texto

## 🔧 Datos Técnicos

### API Endpoints
- **Pública**: `GET /api/banners` (solo banners activos)
- **Admin**: `GET /POST /api/admin/banners` (todos los banners)
- **Admin**: `PUT /DELETE /api/admin/banners/[id]` (editar/eliminar)

### Base de Datos
- Tabla: `banners`
- Campos: id, title, subtitle, imageUrl, link, order, isActive, createdAt, updatedAt

### Componente Frontend
- Archivo: `src/components/Banner.tsx`
- Consume automáticamente los banners de la API
- Fallback: Si no hay banners, muestra banner por defecto

## ✅ Estado Actual

- ✅ Modelo de banners creado en base de datos
- ✅ APIs de administración implementadas
- ✅ Página de gestión funcional con drag & drop
- ✅ Componente Banner actualizado para consumir API
- ✅ Banner inicial sembrado: "De Todo Para Tu Hogar"
- ✅ Navegación agregada en sidebar del admin

## 🚀 Próximos Pasos Sugeridos

1. **Agregar banners promocionales** según tus campañas
2. **Subir imágenes diseñadas** con identidad de marca
3. **Configurar enlaces** a páginas específicas
4. **Reordenar** según prioridad de visualización
5. **Activar/Desactivar** según temporada o promoción

---

¿Necesitas ayuda para crear más banners o diseñar las imágenes? ¡Solo pregunta! 🎯
