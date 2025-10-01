# 🏠 IZA & CAS - Tienda Virtual E-commerce Completa

> **Sistema completo de e-commerce funcional** con carrito de compras, modal de productos, carruseles de imágenes y funcionalidad completa de tienda online desarrollada con Next.js 15, TypeScript y CSS Modules.

## 🚀 Demo en Vivo

🔗 **[Ver Demo](https://github.com/karlascs/tienda-virtual)** | 📱 **Responsive Design** | � **E-commerce Funcional** | 🏠 **IZA & CAS**

## ✨ Características Principales

### 🛒 **E-commerce Funcional Completo**
- **Carrito de compras** dinámico con React Context
- **Modal de detalles** de productos interactivo
- **Botones funcionales** en todas las categorías
- **Contador dinámico** en header del carrito
- **Notificaciones toast** al añadir productos
- **Gestión completa** de cantidades y productos

### 🎨 **Diseño y UX Profesional**
- **Banner IZA&CAS** promocional en página principal
- **Carruseles de imágenes** con navegación avanzada
- **Paleta de colores** IZA&CAS consistente
- **Animaciones suaves** y efectos hover elegantes
- **Responsive design** optimizado para móviles

### ⚡ **Tecnologías Avanzadas**
- **Next.js 15** con App Router y Turbopack
- **TypeScript** para type safety completo
- **React Context API** para gestión de estado global
- **CSS Modules** para estilos aislados y escalables
- **Intersection Observer** para animaciones de scroll

### 🎯 **Funcionalidades Técnicas**
- **40+ Componentes** reutilizables y documentados
- **HTML Semántico** para SEO y accesibilidad
- **Error handling** en carga de imágenes
- **Performance optimizado** con lazy loading
- **Estructura escalable** y mantenible

## 📁 Estructura del Proyecto

```
tienda-next/
├── 📁 .next/                    # Build automático de Next.js
├── 📁 node_modules/             # Dependencias instaladas
├── 📁 public/                   # Recursos estáticos organizados
│   ├── 📁 images/               # 🆕 Estructura organizada de imágenes
│   │   ├── README.md            # Documentación completa
│   │   ├── 🏠 hogar/           # Electrodomésticos y artículos del hogar
│   │   │   ├── README.md        # Guía específica de productos
│   │   │   ├── hervidor-electrico.webp
│   │   │   ├── batidora-inmersion.avif
│   │   │   └── horno-electrico.jpg
│   │   ├── 🔧 herramientas/    # Herramientas eléctricas y manuales
│   │   │   └── README.md
│   │   ├── 🧸 juguetes/        # Juguetes educativos y entretenimiento
│   │   │   └── README.md
│   │   ├── � tecnologia/      # Productos tecnológicos y electrónicos
│   │   │   └── README.md
│   │   └── ⚽ actividad/        # Equipos deportivos y actividades
│   │       └── README.md
│   ├── ⭐ favicon.ico           # Favicon Casa Viva
│   └── 🏠 logo_isa&cas.png     # Logo principal Casa Viva
├── 📁 src/                      # Código fuente organizado
│   ├── 📁 app/                  # App Router de Next.js
│   │   ├── 📁 cart/             # 🆕 Página del carrito
│   │   │   └── page.tsx         # Carrito con estado vacío profesional
│   │   ├── 📁 products/         # 🆕 Sistema de categorías
│   │   │   ├── 🏠 hogar/        # 6 productos de hogar
│   │   │   │   └── page.tsx
│   │   │   ├── 🔧 herramientas/ # 8 herramientas profesionales
│   │   │   │   └── page.tsx
│   │   │   ├── 🧸 juguetes/     # 10 juguetes educativos
│   │   │   │   └── page.tsx
│   │   │   ├── 💻 tecnologia/   # 10 productos tecnológicos
│   │   │   │   └── page.tsx
│   │   │   └── ⚽ actividad/     # 6 equipos deportivos
│   │   │       └── page.tsx
│   │   ├── globals.css          # Sistema de variables CSS expandido
│   │   ├── layout.tsx           # Layout principal con metadatos
│   │   └── page.tsx             # Página de inicio con categorías
│   ├── 📁 components/           # Componentes reutilizables
│   │   ├── Categories.tsx       # 🆕 Componente de categorías
│   │   ├── Categories.module.css # 🆕 Estilos del sistema de categorías
│   │   ├── Header.tsx           # Header con navegación completa
│   │   ├── ProductCard.tsx      # Tarjeta de producto tipada
│   │   └── ProductGrid.tsx      # Grid responsivo de productos
│   └── 📁 styles/               # CSS Modules
│       └── header.module.css    # Estilos del header
├── 📋 .gitignore               # Archivos ignorados por Git
├── 📋 eslint.config.mjs        # Configuración ESLint
├── 📋 next-env.d.ts            # Tipos de Next.js
├── 📋 next.config.ts           # Configuración Next.js
├── 📋 package-lock.json        # Lock de dependencias
├── 📋 package.json             # Dependencias y scripts
├── 📋 postcss.config.mjs       # Configuración PostCSS
├── 📋 README.md                # 🆕 Documentación actualizada
└── 📋 tsconfig.json            # Configuración TypeScript
```
├── 📋 package-lock.json        # Lock de dependencias
├── 📋 package.json             # Dependencias y scripts
├── 📋 postcss.config.mjs       # Configuración PostCSS
├── 📋 README.md                # Documentación del proyecto
└── 📋 tsconfig.json            # Configuración TypeScript
```

## 🛍️ Catálogo Completo de Productos

Casa Viva ofrece un catálogo diversificado con **5 categorías principales** y **40 productos totales**:

### 🏠 Hogar (6 productos)
Electrodomésticos y artículos esenciales para el hogar
- ☕ **Hervidor Eléctrico Premium** - $45.990
- 🥄 **Batidora de Mano Multifunción** - $32.990
- 🔥 **Horno Eléctrico 25L** - $89.990
- 🤖 **Aspiradora Robot Inteligente** - $159.990
- ☕ **Cafetera Express** - $75.990
- 👔 **Plancha Vertical a Vapor** - $42.990

### 🔧 Herramientas (8 productos)
Herramientas profesionales para bricolaje y construcción
- ⚡ **Taladro Percutor 18V** - $89.990
- 🪚 **Sierra Caladora Profesional** - $65.990
- 🔩 **Kit de Destornilladores 32 piezas** - $24.990
- ⚡ **Soldadora Inverter 200A** - $149.990
- ⚙️ **Amoladora Angular 115mm** - $38.990
- 🔧 **Compresor de Aire 24L** - $119.990
- 📏 **Nivel Láser Autonivelante** - $78.990
- 🧰 **Caja de Herramientas Metálica** - $45.990

### 🧸 Juguetes (10 productos)
Juguetes educativos y entretenimiento para todas las edades
- 🧱 **Lego Creator Expert** - $79.990
- 📱 **Tablet Educativa para Niños** - $89.990
- 🚁 **Dron con Cámara HD** - $129.990
- 🏎️ **Pista de Carreras Eléctrica** - $64.990
- 🤖 **Robot Programable** - $119.990
- 🎨 **Kit de Arte y Manualidades** - $34.990
- 🚲 **Bicicleta Eléctrica Infantil** - $189.990
- 🏠 **Casa de Muñecas Moderna** - $94.990
- 🔬 **Set de Ciencia para Niños** - $42.990
- 🎮 **Consola de Videojuegos Portátil** - $159.990

### 💻 Tecnología (10 productos)
Los últimos avances en tecnología y electrónicos
- 📱 **Smartphone 128GB** - $299.990
- 💻 **Laptop Gaming 16GB RAM** - $899.990
- 🎧 **Auriculares Bluetooth Premium** - $129.990
- 🖥️ **Monitor 4K 27 pulgadas** - $349.990
- ⌨️ **Teclado Mecánico RGB** - $89.990
- 📹 **Webcam 4K Profesional** - $79.990
- 🔋 **Power Bank 20000mAh** - $39.990
- ⌚ **Smart Watch Deportivo** - $189.990
- 🌐 **Router Wi-Fi 6 Mesh** - $159.990
- 💾 **Disco SSD 1TB NVMe** - $89.990

### ⚽ Actividad & Deportes (6 productos)
Equipos deportivos para mantener un estilo de vida activo
- 🚵 **Bicicleta Montaña 27.5''** - $349.990
- 🏃 **Cinta de Correr Plegable** - $499.990
- 🏋️ **Set de Pesas Ajustables** - $189.990
- 🚣 **Kayak Inflable 2 Personas** - $279.990
- ⛺ **Carpa Familiar 6 Personas** - $159.990
- � **Patineta Eléctrica** - $229.990

*Todos los productos cuentan con imágenes organizadas y precios competitivos en el mercado chileno.*

## 🛠️ Tecnologías

- **Framework**: Next.js 15 con Turbopack
- **Lenguaje**: TypeScript
- **Estilos**: CSS Modules + CSS Variables
- **Layout**: CSS Grid + Flexbox
- **Imágenes**: Next.js Image optimización
- **Formatos**: WebP, AVIF, JPG (modernos y optimizados)
- **Deployment**: Ready for Vercel
- **Control de Versiones**: Git + GitHub

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Git

### Clonar el repositorio
```bash
git clone https://github.com/karlascs/tienda-virtual.git
cd tienda-next
```

### Instalar dependencias
```bash
npm install
# o
yarn install
```

### Ejecutar en desarrollo
```bash
npm run dev
# o
yarn dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Build para producción
```bash
npm run build
npm start
```

## 🧩 Arquitectura de Componentes

### 🏠 Header
- Logo Casa Viva como elemento principal y focal
- Sistema de navegación completo con 5 categorías
- Navegación sticky con backdrop-filter moderno
- Enlaces directos a páginas específicas de categorías
- Responsive design optimizado para todos los dispositivos

### 🗂️ Categories (Nuevo)
- Componente dedicado para mostrar las 5 categorías principales
- Cards interactivas con iconos representativos
- Contador dinámico de productos por categoría
- Enlaces directos a páginas específicas
- Diseño responsive con CSS Grid avanzado

### 🛒 ProductCard
- Props completamente tipadas con TypeScript
- Formateo automático de precios chilenos (CLP)
- Imágenes optimizadas con object-fit: contain
- Diseño card moderno con efectos hover
- Estructura semántica para SEO

### 📊 ProductGrid  
- Layout responsive con CSS Grid automático
- Catálogo completo con productos reales
- Auto-fit columns (220px mínimo)
- Optimización de imágenes sin recortar
- Manejo eficiente del estado de productos

### 🛍️ Páginas de Categorías (Nuevas)
- 5 páginas dedicadas, una por categoría
- Estructura consistente y reutilizable
- Catálogos específicos con productos relevantes
- Navegación breadcrumb implícita
- Meta tags específicos para SEO

### 🛒 Página de Carrito (Nueva)
- Diseño profesional para estado vacío
- Call-to-action para continuar comprando  
- Preparado para funcionalidad futura
- Componente Link optimizado de Next.js

## 🎯 Objetivos Cumplidos - Sistema Completo

### ✅ **Fase 1: Estructura y Diseño**
- ✅ **Estructura del Proyecto**: Organización escalable con carpetas src/ y public/
- ✅ **HTML Semántico**: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- ✅ **CSS Responsivo**: Grid moderno con auto-fit, sin media queries complejas
- ✅ **Componentes**: División lógica y reutilizable en React con TypeScript
- ✅ **CSS Modules**: Estilos aislados por componente para escalabilidad
- ✅ **Branding**: Logo Casa Viva integrado con favicon y metadatos
- ✅ **Tema Optimizado**: Diseño claro para máxima visibilidad y usabilidad

### ✅ **Fase 2: Sistema de Navegación (Completada)**
- ✅ **5 Categorías Principales**: Hogar, Herramientas, Juguetes, Tecnología, Actividad
- ✅ **Páginas Individuales**: Una página dedicada por cada categoría
- ✅ **Componente Categories**: Sistema visual de navegación por categorías
- ✅ **Navegación Consistente**: Header sincronizado con sistema de categorías
- ✅ **40+ Productos**: Catálogo completo distribuido en todas las categorías
- ✅ **Rutas Semánticas**: URLs descriptivas `/products/categoria`

### ✅ **Fase 3: Organización de Contenido (Completada)**
- ✅ **Estructura de Imágenes**: Carpetas organizadas por categoría
- ✅ **Nomenclatura Consistente**: Convenciones kebab-case para archivos
- ✅ **Documentación Completa**: README en cada carpeta de imágenes
- ✅ **Especificaciones Técnicas**: Guías de formatos, tamaños y optimización
- ✅ **Migración de Assets**: Imágenes existentes reorganizadas correctamente

### ✅ **Fase 4: UX/UI Avanzada (Completada)**
- ✅ **Página de Carrito**: Diseño profesional para estado vacío
- ✅ **Sistema de Variables CSS**: Theming consistente y mantenible  
- ✅ **Efectos Hover**: Interactividad en cards y elementos navegables
- ✅ **Responsive Design**: Adaptación perfecta en todos los dispositivos
- ✅ **Performance**: Optimización de imágenes y componentes

### ✅ **Fase 5: Desarrollo Profesional (Completada)**
- ✅ **TypeScript**: Type safety completo en todo el proyecto
- ✅ **Git Avanzado**: Commits semánticos y historial profesional
- ✅ **Documentación**: README completo y técnicamente detallado
- ✅ **Estructura Escalable**: Preparado para funcionalidades futuras
- ✅ **Best Practices**: Código limpio y mantenible siguiendo estándares

## 🚀 Próximas Fases de Desarrollo

### Fase 6: Funcionalidad Interactiva (Próximamente)
- [ ] **Estado Global**: Context API para manejo del carrito
- [ ] **Carrito Funcional**: Agregar/quitar productos dinámicamente
- [ ] **Filtros Avanzados**: Por precio, categoría, y características
- [ ] **Búsqueda**: Sistema de búsqueda en tiempo real
- [ ] **Modal de Productos**: Vista detallada con galería de imágenes
- [ ] **Wishlist**: Sistema de lista de deseos persistente

### Fase 7: Datos Dinámicos y Backend (Futuro)
- [ ] **API Routes**: Backend con Next.js API routes
- [ ] **Base de Datos**: PostgreSQL o MongoDB para productos
- [ ] **CRUD Admin**: Panel de administración para gestión
- [ ] **Autenticación**: Sistema de usuarios con NextAuth
- [ ] **Inventario**: Gestión de stock y disponibilidad
- [ ] **Analytics**: Tracking de productos más vistos

### Fase 8: E-commerce Completo (Visión a Largo Plazo)
- [ ] **Pasarela de Pagos**: Integración con Stripe/MercadoPago
- [ ] **Sistema de Envíos**: Cálculo de costos y tracking
- [ ] **Reviews**: Sistema de calificaciones y comentarios
- [ ] **Promociones**: Cupones, descuentos y ofertas especiales
- [ ] **Multi-idioma**: Soporte para inglés y español
- [ ] **PWA**: Aplicación web progresiva con offline support

## 🌐 URLs del Sistema

### Páginas Principales
- `/` - Página de inicio con categorías destacadas
- `/cart` - Carrito de compras (estado vacío profesional)

### Páginas de Categorías
- `/products/hogar` - 6 productos para el hogar
- `/products/herramientas` - 8 herramientas profesionales  
- `/products/juguetes` - 10 juguetes educativos
- `/products/tecnologia` - 10 productos tecnológicos
- `/products/actividad` - 6 equipos deportivos

### Estructura de Imágenes
```
/images/hogar/[producto].extension
/images/herramientas/[producto].extension  
/images/juguetes/[producto].extension
/images/tecnologia/[producto].extension
/images/actividad/[producto].extension
```

## 📱 Responsive Design

- **Desktop**: Grid de múltiples columnas con logo prominente
- **Tablet**: Adaptación automática del grid (2-3 columnas)  
- **Mobile**: Single column con logo centrado

*El logo Casa Viva se adapta perfectamente a todos los dispositivos*

## 🎨 Sistema de Diseño

```css
:root {
  /* Colores principales */
  --bg: rgb(199, 255, 255);     /* Fondo principal - celeste suave Casa Viva */
  --card: #ffffff;              /* Fondo de tarjetas - blanco puro */
  --text: #1e293b;              /* Texto principal - gris oscuro */
  --muted: #64748b;             /* Texto secundario - gris medio */
  --brand: #2563eb;             /* Color de marca - azul profesional */
  --border: #e2e8f0;            /* Bordes - gris muy claro */
  --shadow: rgba(0, 0, 0, 0.1); /* Sombras suaves */
  
  /* Variables adicionales para categorías */
  --background-secondary: #f8fafc;   /* Fondo secundario */
  --text-primary: var(--text);       /* Texto principal */
  --text-secondary: var(--muted);    /* Texto secundario */
  --primary-color: var(--brand);     /* Color primario */
  --border-color: var(--border);     /* Color de borde */
  --card-background: var(--card);    /* Fondo de tarjetas */
}
```

**Diseño completamente optimizado para Casa Viva con identidad visual consistente**

### 🎯 Principios de Diseño
- **Minimalista**: Enfoque en productos y contenido
- **Consistente**: Variables CSS para coherencia visual
- **Accesible**: Contraste adecuado y navegación clara  
- **Responsive**: Adaptación perfecta en todos los dispositivos
- **Profesional**: Colores y tipografía que inspiran confianza

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👩‍💻 Autor

**Karla Cuevas** - [@karlascs](https://github.com/karlascs)

### 🏆 Logros del Proyecto IZA & CAS
- ✅ **E-commerce Funcional** - Carrito, modal y funcionalidad completa
- ✅ **Sistema de Carrusel** - Navegación avanzada de imágenes
- ✅ **Banner Promocional** - IZA&CAS integrado con animaciones
- ✅ **Gestión de Estado** - React Context API implementado
- ✅ **UX/UI Profesional** - Animaciones y efectos elegantes
- ✅ **Arquitectura Escalable** - Preparado para crecimiento futuro  
- ✅ **Branding Consistente** - Paleta IZA&CAS en todo el sitio
- ✅ **Responsive Design** - Optimizado para todos los dispositivos
- ✅ **Performance Optimizado** - Next.js 15 con Turbopack
- ✅ **Código Limpio** - TypeScript, CSS Modules y best practices
- ✅ **Documentación Técnica** - README completo y detallado

### 📊 Estadísticas del Proyecto
- **35+ productos** distribuidos en 5 categorías
- **15+ componentes** reutilizables y tipados
- **8 páginas** con navegación completa y funcionalidad
- **Carrito funcional** con gestión completa de estado
- **Sistema de modal** con detalles de productos
- **Carruseles avanzados** con múltiples imágenes
- **Banner promocional** con animaciones
- **Estructura organizada** de +70 archivos
- **Responsive design** 100% funcional
- **TypeScript** coverage completo

### 🆕 Nuevas Funcionalidades Implementadas (v2.0)

#### 🛒 **Sistema de E-commerce Completo**
- **CartContext**: Gestión global del estado del carrito
- **Botones funcionales**: "Añadir al carrito" en todas las categorías
- **Contador dinámico**: Header actualiza automáticamente
- **Página de carrito**: Gestión completa con +/- cantidades
- **Notificaciones**: Toast animadas al añadir productos

#### 📱 **Componentes Avanzados**
- **ProductModal**: Modal interactivo con detalles completos
- **ProductCarousel**: Carrusel con navegación por teclado y táctil
- **Banner**: Componente promocional IZA&CAS responsive
- **Hooks personalizados**: useScrollAnimation, useCarouselKeyboard

#### 🎨 **Mejoras de Diseño**
- **Paleta IZA&CAS**: Verde oscuro (#2d4a4a) y beige dorado (#d4a574)
- **Animaciones suaves**: Scroll animations y efectos hover
- **CSS Modules**: Estilos específicos por categoría
- **Error handling**: Placeholders para imágenes faltantes

#### ⚡ **Optimizaciones Técnicas**
- **React Context API**: Estado global eficiente
- **TypeScript**: Tipado completo en todos los componentes
- **Performance**: Lazy loading y optimización de imágenes
- **SEO mejorado**: Meta tags y estructura semántica

---

⭐ **¡IZA & CAS - Tu tienda de confianza para el hogar y más!** 🏠  
🛍️ **E-commerce completo desarrollado con las últimas tecnologías** 💻  
🎯 **v2.0 - Carrito funcional, modal de productos y carruseles avanzados** �
