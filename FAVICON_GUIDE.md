# 🎨 Guía para crear Favicon de Casa Viva

## Pasos para crear un favicon profesional:

### 1. Preparar la imagen base
- Usa la imagen que compartiste del logo Casa Viva
- Guárdala como `casaviva_logo.png`

### 2. Crear favicon.ico online
Usa uno de estos servicios gratuitos:

- **Favicon.io**: https://favicon.io/favicon-converter/
- **RealFaviconGenerator**: https://realfavicongenerator.net/
- **Favicon Generator**: https://www.favicon-generator.org/

### 3. Configuración recomendada
- **Tamaño principal**: 32x32px o 16x16px
- **Formato**: ICO (soporta múltiples tamaños)
- **Fondo**: Transparente o el mismo del logo

### 4. Archivos que deberías generar
```
public/
├── favicon.ico          # Favicon principal
├── favicon-16x16.png    # 16x16 píxeles
├── favicon-32x32.png    # 32x32 píxeles
├── apple-touch-icon.png # 180x180 píxeles (iOS)
└── android-chrome-192x192.png # 192x192 píxeles (Android)
```

### 5. Una vez generados los archivos
Copia todos los archivos a la carpeta `public/` del proyecto:
```
c:\Users\Karla\Desktop\proyecto fron end\tienda-next\public\
```

### 6. La configuración ya está lista
Ya configuré el metadata en `layout.tsx` para usar los favicons.

## 🚀 Resultado esperado
- Favicon de Casa Viva en la pestaña del navegador
- Icono correcto en marcadores
- Icono optimizado para móviles (iOS/Android)
