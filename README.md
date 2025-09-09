# 🛒 Tienda Virtual - Next.js

> **Fase 1: MVP Estático** - Proyecto de e-commerce moderno desarrollado con Next.js 15, TypeScript y CSS Modules.

## 🚀 Demo en Vivo

🔗 **[Ver Demo](https://github.com/karlascs/tienda-virtual)** | 📱 **Responsive Design**

## ✨ Características

- ⚡ **Next.js 15** con App Router
- 🎯 **TypeScript** para type safety
- 🎨 **CSS Modules** para estilos aislados
- 📱 **Responsive Design** con CSS Grid
- 🧩 **Componentes Reutilizables**
- 🌙 **Tema Oscuro** incorporado
- 🏷️ **HTML Semántico** para SEO y accesibilidad
- 💰 **Formateo de Precios** en pesos chilenos (CLP)

## 📁 Estructura del Proyecto

```
tienda-next/
├── src/
│   ├── app/                 # App Router de Next.js
│   │   ├── globals.css      # Estilos globales y variables
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Página de inicio
│   ├── components/          # Componentes reutilizables
│   │   ├── Header.tsx       # Header con navegación
│   │   ├── ProductCard.tsx  # Tarjeta de producto
│   │   └── ProductGrid.tsx  # Grid de productos
│   └── styles/              # CSS Modules
│       ├── header.module.css
│       └── card.module.css
├── public/                  # Recursos estáticos
└── package.json
```

## 🛠️ Tecnologías

- **Framework**: Next.js 15
- **Lenguaje**: TypeScript
- **Estilos**: CSS Modules + CSS Variables
- **Layout**: CSS Grid + Flexbox
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
- Navegación sticky
- Branding con logo
- Enlaces de navegación
- Responsive design

### ProductCard
- Props tipadas con TypeScript
- Formateo de precios automático
- Imágenes optimizadas
- Diseño card moderno

### ProductGrid
- Layout responsive con CSS Grid
- Datos mock integrados
- Auto-fit columns (220px mínimo)
- Gap consistente

## 🎯 Objetivos Cumplidos (Fase 1)

- ✅ **Estructura del Proyecto**: Organización clara en carpetas
- ✅ **HTML Semántico**: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- ✅ **CSS Responsivo**: Grid moderno sin media queries
- ✅ **Componentes**: División lógica y reutilizable
- ✅ **TypeScript**: Props tipadas y type safety
- ✅ **CSS Modules**: Estilos aislados por componente
- ✅ **Git**: Historial de commits y repositorio configurado

## 🚀 Próximas Fases

### Fase 2: Funcionalidad (Próximamente)
- [ ] Estado global con Context API
- [ ] Carrito de compras funcional
- [ ] Sistema de filtros
- [ ] Modal de detalles de producto

### Fase 3: Datos Dinámicos (Próximamente)
- [ ] API Routes de Next.js
- [ ] Base de datos (MongoDB/PostgreSQL)
- [ ] CRUD de productos
- [ ] Sistema de autenticación

## 📱 Responsive Design

- **Desktop**: Layout de múltiples columnas
- **Tablet**: Adaptación automática del grid
- **Mobile**: Single column optimizado

## 🎨 Tema y Colores

```css
:root {
  --bg: #0b0d12;      /* Fondo principal */
  --card: #121521;    /* Fondo de tarjetas */
  --text: #e6e9f2;    /* Texto principal */
  --muted: #8892a6;   /* Texto secundario */
  --brand: #6aa3ff;   /* Color de marca */
}
```

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

---

⭐ **Si te gusta este proyecto, ¡dale una estrella!**
