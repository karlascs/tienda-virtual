# 🌿 Estrategia de Ramas para GitHub Público

Esta guía describe cómo organizar el proyecto en diferentes ramas para facilitar la navegación y comprensión del código.

## 📋 Estructura de Ramas Propuesta

### 🌳 Rama Principal

#### `main` (rama principal - pública)
- **Contenido**: Proyecto completo sanitizado
- **Propósito**: Código base con todas las características
- **Estado**: Listo para producción (sin datos sensibles)
- **README**: Versión pública genérica

---

### 🎨 Ramas por Características (Features)

#### `feature/frontend-components`
**Componentes de UI y diseño**
```
Incluye:
- src/components/
  ├── Header.tsx
  ├── Footer.tsx
  ├── ProductCard.tsx
  ├── ProductGrid.tsx
  ├── ProductModal.tsx
  ├── SearchBar.tsx
  ├── FilterPanel.tsx
  ├── Categories.tsx
  └── ...
- src/styles/
- CSS Modules
```

**Puntos destacados:**
- Sistema de componentes reutilizables
- Diseño modular con CSS Modules
- TypeScript para props typing

---

#### `feature/responsive-design`
**Diseño responsivo y mobile-first**
```
Incluye:
- Breakpoints y media queries
- Grid adaptativo
- Mobile menu hamburguesa
- Diseño tablet y desktop
- Touch-friendly interfaces
```

**Puntos destacados:**
- Mobile-first approach
- 6 breakpoints optimizados
- Grid CSS automático (4→3→2→1 columnas)

---

#### `feature/backend-api`
**API Routes y lógica de servidor**
```
Incluye:
- src/app/api/
  ├── auth/
  ├── products/
  ├── categories/
  ├── orders/
  ├── checkout/
  └── admin/
- Prisma schema
- Validaciones con Zod
```

**Puntos destacados:**
- Next.js API Routes
- Integración con Prisma ORM
- Validación de datos
- Rate limiting

---

#### `feature/authentication`
**Sistema de autenticación**
```
Incluye:
- src/auth.ts
- src/middleware.ts
- NextAuth.js v5 configuration
- Sistema de roles (USER, ADMIN)
- Páginas de login/register
```

**Puntos destacados:**
- NextAuth.js v5
- Protección de rutas
- Middleware de autorización
- Hashing con bcrypt

---

#### `feature/admin-panel`
**Panel de administración completo**
```
Incluye:
- src/app/admin/
  ├── dashboard/
  ├── products/
  ├── categories/
  ├── orders/
  ├── inventory/
  ├── sales/
  └── banners/
- Componentes específicos del admin
- Estilos del panel
```

**Puntos destacados:**
- Dashboard con estadísticas
- CRUD completo de productos
- Gestión de inventario
- Sistema de ventas
- Diseño responsive para admin

---

#### `feature/payment-integration`
**Integración de pagos con Transbank**
```
Incluye:
- src/lib/transbank.ts
- src/app/api/checkout/
- Flujo completo de pago
- Manejo de confirmaciones
- Páginas de éxito/error
```

**Puntos destacados:**
- Transbank Webpay Plus SDK
- Cálculo de comisiones
- Flujo completo de transacción
- Manejo de errores

---

#### `feature/shipping-integration`
**Integración de envíos con Chilexpress**
```
Incluye:
- src/lib/chilexpress.ts
- API de cotización
- Componente ShippingOptions
- Cálculo dinámico de costos
```

**Puntos destacados:**
- Chilexpress API
- Cotización en tiempo real
- Múltiples opciones de envío
- Fallback automático

---

#### `feature/guest-checkout`
**Checkout para invitados**
```
Incluye:
- src/components/GuestCheckoutForm.tsx
- Validación de RUT chileno
- Formulario optimizado
- Google Maps autocomplete (opcional)
```

**Puntos destacados:**
- Compra sin registro
- Validación Módulo 11 (RUT)
- UX optimizada para conversión
- Integración con Google Maps

---

#### `feature/database-schema`
**Esquema de base de datos**
```
Incluye:
- prisma/schema.prisma
- prisma/migrations/
- prisma/seeders/
- 14 modelos relacionados
```

**Puntos destacados:**
- Prisma ORM
- Migraciones versionadas
- Seeders de datos
- Relaciones complejas

---

#### `feature/cart-wishlist`
**Carrito y lista de deseos**
```
Incluye:
- src/context/CartContext.tsx
- src/context/WishlistContext.tsx
- src/app/cart/
- src/app/wishlist/
- Persistencia con localStorage
```

**Puntos destacados:**
- React Context API
- Estado global
- Persistencia local
- Sincronización

---

#### `feature/search-filters`
**Búsqueda y sistema de filtros**
```
Incluye:
- src/context/SearchContext.tsx
- src/context/FilterContext.tsx
- src/components/SearchBar.tsx
- src/components/FilterPanel.tsx
```

**Puntos destacados:**
- Búsqueda en tiempo real
- Filtros por categoría y precio
- Autocompletado
- Resultados dinámicos

---

#### `feature/product-categories`
**Sistema de categorías de productos**
```
Incluye:
- src/app/products/
  ├── electrohogar/
  ├── hogar/
  ├── herramientas/
  ├── juguetes/
  ├── tecnologia/
  ├── actividad/
  └── cuidadopersonal/
- 7 categorías completas
- 65+ productos
```

**Puntos destacados:**
- 7 categorías diferentes
- Páginas individuales
- Productos reales
- Imágenes organizadas

---

## 🚀 Comandos para Crear las Ramas

### Opción 1: Crear todas las ramas desde main

```bash
# Asegurarte de estar en main
git checkout main

# Crear ramas de features
git checkout -b feature/frontend-components
git checkout main

git checkout -b feature/responsive-design
git checkout main

git checkout -b feature/backend-api
git checkout main

git checkout -b feature/authentication
git checkout main

git checkout -b feature/admin-panel
git checkout main

git checkout -b feature/payment-integration
git checkout main

git checkout -b feature/shipping-integration
git checkout main

git checkout -b feature/guest-checkout
git checkout main

git checkout -b feature/database-schema
git checkout main

git checkout -b feature/cart-wishlist
git checkout main

git checkout -b feature/search-filters
git checkout main

git checkout -b feature/product-categories
git checkout main
```

### Opción 2: Script automatizado

```powershell
# Crear archivo create-branches.ps1
$branches = @(
    "feature/frontend-components",
    "feature/responsive-design",
    "feature/backend-api",
    "feature/authentication",
    "feature/admin-panel",
    "feature/payment-integration",
    "feature/shipping-integration",
    "feature/guest-checkout",
    "feature/database-schema",
    "feature/cart-wishlist",
    "feature/search-filters",
    "feature/product-categories"
)

foreach ($branch in $branches) {
    git checkout -b $branch main
    Write-Host "✅ Rama creada: $branch" -ForegroundColor Green
}

git checkout main
Write-Host "✅ Todas las ramas creadas. Volviendo a main." -ForegroundColor Cyan
```

---

## 📝 Archivo README para cada Rama

Cada rama debe incluir un `README-FEATURE.md` específico explicando:

1. **Objetivo de la rama**
2. **Archivos principales incluidos**
3. **Tecnologías utilizadas**
4. **Cómo probar la funcionalidad**
5. **Dependencias necesarias**
6. **Capturas de pantalla (si aplica)**

---

## 🎯 Beneficios de esta Estructura

### ✅ Para Desarrolladores
- Facilita encontrar código específico
- Permite estudiar features de forma aislada
- Mejor organización del trabajo
- Historial de commits más limpio

### ✅ Para Reclutadores/Revisores
- Ven tu capacidad de organización
- Pueden revisar features específicas
- Demuestras dominio de Git
- Proyecto más profesional

### ✅ Para Contribuidores
- Fácil identificar dónde contribuir
- Menos conflictos de merge
- Mejor revisión de código
- Documentación clara

---

## 📊 Ejemplo de Flujo de Trabajo

### 1. Iniciar nuevo feature
```bash
git checkout main
git pull origin main
git checkout -b feature/nueva-funcionalidad
```

### 2. Desarrollar y commitear
```bash
git add .
git commit -m "feat: agregar nueva funcionalidad"
```

### 3. Pushear rama
```bash
git push origin feature/nueva-funcionalidad
```

### 4. Crear Pull Request
- Ir a GitHub
- Crear PR desde `feature/nueva-funcionalidad` hacia `main`
- Describir cambios
- Solicitar revisión

### 5. Merge a main
```bash
git checkout main
git merge feature/nueva-funcionalidad
git push origin main
```

---

## 🔄 Sincronización de Ramas

Para mantener todas las ramas actualizadas:

```bash
# Script update-all-branches.ps1
$branches = git branch --format="%(refname:short)"

foreach ($branch in $branches) {
    if ($branch -ne "main") {
        git checkout $branch
        git merge main
        git push origin $branch
        Write-Host "✅ $branch actualizada" -ForegroundColor Green
    }
}

git checkout main
```

---

## 📖 Documentación Recomendada

### En main:
- `README.md` - Documentación principal
- `GUIA-SANITIZACION.md` - Guía de seguridad
- `ESTRUCTURA-RAMAS.md` - Este archivo
- `CONTRIBUTING.md` - Guía de contribución

### En cada feature branch:
- `README-FEATURE.md` - Documentación específica
- Ejemplos de uso
- Screenshots si aplica

---

## ✅ Checklist Pre-Push

Antes de pushear cualquier rama:

- [ ] Código sanitizado (sin datos sensibles)
- [ ] .env en .gitignore
- [ ] README actualizado
- [ ] Commits descriptivos
- [ ] Sin conflictos con main
- [ ] Tests pasando (si aplica)
- [ ] Documentación actualizada

---

## 🎓 Recursos Adicionales

- [Git Branching Model](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

**⭐ Con esta estructura, tu proyecto se verá profesional y bien organizado en GitHub público.**
