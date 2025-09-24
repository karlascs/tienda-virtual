# 📁 Estructura de Imágenes - Casa Viva

Esta carpeta contiene todas las imágenes organizadas por categorías para facilitar el mantenimiento y evitar confusiones en los enlaces.

## 🗂️ Estructura de Carpetas

```
public/images/
├── hogar/              🏠 Electrodomésticos y artículos para el hogar
├── herramientas/       🔧 Herramientas eléctricas y manuales
├── juguetes/          🧸 Juguetes educativos y entretenimiento
├── tecnologia/        💻 Productos tecnológicos y electrónicos
└── actividad/         ⚽ Equipos deportivos y actividades al aire libre
```

## 🔗 Rutas de Enlaces

### Patrón de URLs:
```
/images/[categoria]/[nombre-producto].[extension]
```

### Ejemplos:
- **Hogar**: `/images/hogar/hervidor-electrico.jpg`
- **Herramientas**: `/images/herramientas/taladro-percutor.jpg`
- **Juguetes**: `/images/juguetes/lego-creator.jpg`
- **Tecnología**: `/images/tecnologia/smartphone-128gb.jpg`
- **Actividad**: `/images/actividad/bici-montana.jpg`

## 📋 Convenciones de Nombres

### ✅ Formato Correcto:
- `hervidor-electrico.jpg`
- `batidora-inmersion.avif`
- `taladro-percutor.webp`

### ❌ Evitar:
- `Hervidor Eléctrico.jpg` (espacios y mayúsculas)
- `batidoraInmersión.avif` (caracteres especiales)
- `taladro_percutor.webp` (guiones bajos)

## 🎯 Formatos Recomendados

| Formato | Uso Recomendado | Ventajas |
|---------|----------------|----------|
| **WebP** | Productos principales | Mejor compresión, calidad excelente |
| **AVIF** | Productos premium | Última generación, máxima compresión |
| **JPG** | Compatibilidad general | Universal, buena compresión |
| **PNG** | Fondos transparentes | Sin pérdida, transparencia |

## 📏 Especificaciones Técnicas

### Tamaños Recomendados:
- **Ancho**: 300-600px
- **Alto**: 300-500px
- **Peso máximo**: 150-200KB
- **Ratio**: Cuadrado o ligeramente rectangular (4:3, 1:1)

### Optimización:
1. Comprimir imágenes antes de subir
2. Usar formatos modernos (WebP, AVIF)
3. Mantener buena calidad visual
4. Probar en diferentes dispositivos

## 🔄 Actualización de Rutas

### En los componentes de páginas:
```tsx
// Antes (desorganizado)
image: "/hervidor-electrico.jpg"

// Después (organizado)
image: "/images/hogar/hervidor-electrico.jpg"
```

## 🚀 Próximos Pasos

1. **Migrar imágenes existentes** a sus carpetas correspondientes
2. **Actualizar rutas** en los componentes de las páginas
3. **Agregar nuevas imágenes** siguiendo la estructura
4. **Optimizar imágenes** existentes si es necesario

---
*Estructura creada el 24 de septiembre de 2025 por Karla Cuevas*