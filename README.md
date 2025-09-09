# 🏠 Casa Viva - Tienda de Electrodomésticos

> **Fase 1: MVP Estático** - Tienda de electrodomésticos para el hogar desarrollada con Next.js 15, TypeScript y CSS Modules.

## 🚀 Demo en Vivo

🔗 **[Ver Demo](https://github.com/karlascs/tienda-virtual)** | 📱 **Responsive Design** | 🏠 **Casa Viva**

## ✨ Características

- ⚡ **Next.js 15** con App Router
- 🎯 **TypeScript** para type safety
- 🎨 **CSS Modules** para estilos aislados
- 📱 **Responsive Design** con CSS Grid
- 🧩 **Componentes Reutilizables**
- � **Tema Claro** optimizado para logo transparente
- 🏷️ **HTML Semántico** para SEO y accesibilidad
- 💰 **Formateo de Precios** en pesos chilenos (CLP)
- 🏠 **Logo Casa Viva** integrado y optimizado
- 🖼️ **Imágenes Reales** de productos

## 📁 Estructura del Proyecto

```
tienda-next/
├── 📁 .next/                    # Build automático de Next.js
├── 📁 node_modules/             # Dependencias instaladas
├── 📁 public/                   # Recursos estáticos optimizados
│   ├── 🥄 batidora.avif         # Imagen batidora (formato moderno)
│   ├── 🔄 batidoraInmersión.avif # Imagen batidora inmersión
│   ├── ⭐ favicon.ico           # Favicon Casa Viva
│   ├── ☕ hervidor.webp         # Imagen hervidor (WebP optimizado)
│   ├── 🔥 hornoelectrico.jpg    # Imagen horno eléctrico
│   └── 🏠 logo_casaviva.png     # Logo principal Casa Viva
├── 📁 src/                      # Código fuente organizado
│   ├── 📁 app/                  # App Router de Next.js
│   │   ├── globals.css          # Estilos globales y variables
│   │   ├── layout.tsx           # Layout principal
│   │   └── page.tsx             # Página de inicio
│   ├── 📁 components/           # Componentes reutilizables
│   │   ├── Header.tsx           # Header con logo Casa Viva
│   │   ├── ProductCard.tsx      # Tarjeta de producto tipada
│   │   └── ProductGrid.tsx      # Grid responsivo de productos
│   └── 📁 styles/               # CSS Modules
│       ├── header.module.css    # Estilos del header
│       └── card.module.css      # Estilos de tarjetas
├── 📋 .gitignore               # Archivos ignorados por Git
├── 📋 eslint.config.mjs        # Configuración ESLint
├── 📋 next-env.d.ts            # Tipos de Next.js
├── 📋 next.config.ts           # Configuración Next.js
├── 📋 package-lock.json        # Lock de dependencias
├── 📋 package.json             # Dependencias y scripts
├── 📋 postcss.config.mjs       # Configuración PostCSS
├── 📋 README.md                # Documentación del proyecto
└── 📋 tsconfig.json            # Configuración TypeScript
```

##  Catálogo de Productos

Casa Viva ofrece una selección cuidadosamente curada de electrodomésticos para el hogar:

### 🍳 Electrodomésticos de Cocina
- ☕ **Hervidor Eléctrico 1.7L** - $29.990
- 🥄 **Batidora** - $59.990
- � **Batidora de Inmersión** - $25.990
- 🔥 **Horno Eléctrico** - $42.990

*Todos los productos cuentan con imágenes reales y precios competitivos en el mercado chileno.*

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

## 🎨 Componentes

### Header
- Logo Casa Viva como elemento principal
- Navegación sticky con backdrop-filter
- Branding consistente con favicon
- Responsive design optimizado

### ProductCard
- Props tipadas con TypeScript
- Formateo automático de precios chilenos
- Imágenes optimizadas con object-fit: contain
- Diseño card moderno con sombras

### ProductGrid
- Layout responsive con CSS Grid
- Catálogo de electrodomésticos reales
- Auto-fit columns (220px mínimo)
- Imágenes completas sin recortar

## 🎯 Objetivos Cumplidos (Fase 1)

- ✅ **Estructura del Proyecto**: Organización clara en carpetas src/
- ✅ **HTML Semántico**: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- ✅ **CSS Responsivo**: Grid moderno con auto-fit, sin media queries
- ✅ **Componentes**: División lógica y reutilizable en React
- ✅ **TypeScript**: Props tipadas y type safety completo
- ✅ **CSS Modules**: Estilos aislados por componente
- ✅ **Branding**: Logo Casa Viva integrado con favicon
- ✅ **Imágenes Reales**: Catálogo de electrodomésticos auténtico
- ✅ **Tema Optimizado**: Diseño claro para máxima visibilidad
- ✅ **Git**: Historial de commits descriptivo y profesional

## 🚀 Próximas Fases

### Fase 2: Funcionalidad (Próximamente)
- [ ] Estado global con Context API
- [ ] Carrito de compras funcional
- [ ] Sistema de filtros por categorías
- [ ] Modal de detalles de producto
- [ ] Wishlist/Lista de deseos

### Fase 3: Datos Dinámicos (Próximamente)
- [ ] API Routes de Next.js
- [ ] Base de datos (MongoDB/PostgreSQL)
- [ ] CRUD de electrodomésticos
- [ ] Sistema de autenticación
- [ ] Panel de administración

### Fase 4: E-commerce Completo (Futuro)
- [ ] Pasarela de pagos
- [ ] Gestión de inventario
- [ ] Sistema de envíos
- [ ] Reviews y calificaciones

## 📱 Responsive Design

- **Desktop**: Grid de múltiples columnas con logo prominente
- **Tablet**: Adaptación automática del grid (2-3 columnas)  
- **Mobile**: Single column con logo centrado

*El logo Casa Viva se adapta perfectamente a todos los dispositivos*

## 🎨 Tema y Colores

```css
:root {
  --bg: #f8fafc;        /* Fondo principal - blanco suave */
  --card: #ffffff;      /* Fondo de tarjetas - blanco puro */
  --text: #1e293b;      /* Texto principal - gris oscuro */
  --muted: #64748b;     /* Texto secundario - gris medio */
  --brand: #2563eb;     /* Color de marca - azul profesional */
  --border: #e2e8f0;    /* Bordes - gris muy claro */
  --shadow: rgba(0, 0, 0, 0.1); /* Sombras suaves */
}
```

**Diseño optimizado para logo transparente de Casa Viva**

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👩‍💻 Autor

**Karla** - [@karlascs](https://github.com/karlascs)

### 🏆 Logros del Proyecto Casa Viva
- ✅ **MVP Fase 1** completado exitosamente
- ✅ **Branding completo** con logo y favicon
- ✅ **Catálogo real** de electrodomésticos
- ✅ **Código documentado** profesionalmente
- ✅ **Responsive design** optimizado

---

⭐ **¡Casa Viva - Tu hogar, nuestro compromiso!** 🏠
