# 🛍️ E-commerce Full-Stack con Next.js

> **E-commerce profesional** desarrollado con Next.js 15, Prisma, PostgreSQL, NextAuth.js, integración de pagos con Transbank Webpay Plus, envíos con Chilexpress API, y diseño 100% responsivo.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Características Principales

### 💳 Sistema de Pagos
- **Transbank Webpay Plus** - Integración completa con SDK oficial
- **Cálculo automático** de comisiones (2.95% + IVA)
- **Flujo completo**: crear → redirigir → confirmar → éxito
- **Entorno de integración** configurado para testing

### 🚚 Gestión de Envíos
- **Chilexpress API** - Cotización en tiempo real
- **Múltiples servicios**: Normal, Express, Prioritario
- **Cálculo por ubicación** (región, comuna, ciudad)
- **Fallback automático** si API no disponible

### 👤 Checkout Flexible
- **Checkout sin registro** para conversión rápida
- **Validación de RUT** chileno (Módulo 11)
- **Autocomplete de direcciones** con Google Maps (opcional)
- **Formularios optimizados** con validación en tiempo real

### 📱 Diseño Responsivo
- **Mobile-first design** optimizado para todos los dispositivos
- **Panel de administración** responsive con sidebar deslizante
- **Breakpoints inteligentes**: 480px, 768px, 1024px
- **Grid dinámico** que se adapta automáticamente

### 🔐 Autenticación y Seguridad
- **NextAuth.js v5** con autenticación por credenciales
- **Sistema de roles**: USER, ADMIN
- **Passwords hasheados** con bcrypt
- **Rate limiting** en APIs críticas
- **CSRF protection** en formularios

### 📊 Panel de Administración
- **Dashboard** con estadísticas en tiempo real
- **Gestión CRUD** completa de productos
- **Control de inventario** con alertas de stock bajo
- **Sistema de ventas** con registro manual y automático
- **Gestión de categorías** y banners
- **Vista de órdenes** con actualización de estados

### 🗄️ Base de Datos
- **Prisma ORM** con PostgreSQL
- **14 modelos relacionados** (User, Product, Order, etc.)
- **Migraciones versionadas** con historial completo
- **Seeders** para datos de prueba
- **Índices optimizados** para queries rápidas

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15.5.2** - App Router y Turbopack
- **React 19** - Server Components
- **TypeScript 5** - Type safety completo
- **CSS Modules** - Estilos con scope local

### Backend
- **Prisma ORM 6.19.0** - PostgreSQL
- **NextAuth.js v5** - Autenticación
- **bcryptjs** - Hashing de passwords
- **Zod** - Validación de schemas

### Integraciones
- **Transbank SDK** - Webpay Plus para pagos
- **Chilexpress API** - Cotización de envíos
- **Google Maps API** - Autocomplete de direcciones (opcional)

### DevOps
- **Docker** - Containerización con docker-compose
- **Git** - Control de versiones
- **ESLint** - Linting de código

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL 14+
- npm o yarn
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/tu-proyecto.git
cd tu-proyecto
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Editar `.env` con tus valores:

```env
# Database
DATABASE_URL="postgresql://usuario:password@localhost:5432/nombre_db"

# NextAuth
AUTH_SECRET="tu-secret-generado"  # Genera con: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Transbank (Integración para testing)
TRANSBANK_COMMERCE_CODE="597055555532"
TRANSBANK_API_KEY="579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C"
TRANSBANK_ENVIRONMENT="integration"

# Opcional: Chilexpress, Google Maps
```

### 4. Configurar base de datos
```bash
# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Poblar base de datos (opcional)
npx prisma db seed
```

### 5. Crear usuario administrador
```bash
npx ts-node scripts/check-admin.ts
```

Credenciales por defecto:
- Email: `admin@example.com`
- Password: `Admin123!`

**⚠️ Cambia estas credenciales en producción**

### 6. Ejecutar en desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 7. Build para producción
```bash
npm run build
npm start
```

## 🐳 Despliegue con Docker

### Docker Compose (recomendado)
```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 🌐 Despliegue en la Nube

### Vercel (Frontend)
1. Conectar repositorio en [vercel.com](https://vercel.com)
2. Configurar variables de entorno
3. Deploy automático con cada push

### Railway (Backend + Database)
1. Crear proyecto en [railway.app](https://railway.app)
2. Conectar GitHub repo
3. Agregar PostgreSQL addon
4. Configurar variables de entorno
5. Deploy automático

## 📁 Estructura del Proyecto

```
proyecto/
├── src/
│   ├── app/              # App Router de Next.js
│   │   ├── admin/        # Panel de administración
│   │   ├── checkout/     # Proceso de compra
│   │   ├── products/     # Categorías de productos
│   │   └── api/          # API Routes
│   ├── components/       # Componentes reutilizables
│   ├── context/          # React Context APIs
│   ├── lib/              # Utilidades y configuraciones
│   └── types/            # Tipos TypeScript
├── prisma/
│   ├── schema.prisma     # Esquema de base de datos
│   ├── migrations/       # Migraciones
│   └── seeders/          # Scripts de población
├── public/
│   └── images/           # Imágenes organizadas por categoría
├── .env.example          # Variables de entorno de ejemplo
├── docker-compose.yml    # Configuración Docker
└── package.json          # Dependencias
```

## 🎯 Funcionalidades

### Para Clientes
- ✅ Navegación pública sin registro
- ✅ Búsqueda y filtrado de productos
- ✅ Carrito de compras persistente
- ✅ Checkout con/sin registro
- ✅ Pago con Transbank Webpay Plus
- ✅ Cotización automática de envíos
- ✅ Seguimiento de órdenes
- ✅ Lista de deseos

### Para Administradores
- ✅ Dashboard con estadísticas
- ✅ Gestión completa de productos
- ✅ Gestión de categorías
- ✅ Control de inventario
- ✅ Sistema de ventas
- ✅ Gestión de banners
- ✅ Vista y gestión de órdenes

## 📊 Estadísticas

- **46 páginas** generadas
- **14 modelos** de base de datos
- **40+ componentes** React
- **30+ rutas API**
- **Build exitoso** sin errores TypeScript
- **First Load JS**: 135 kB
- **Responsive**: 100% funcional

## 🔒 Seguridad

- ✅ Passwords hasheados con bcrypt
- ✅ CSRF protection
- ✅ Rate limiting en APIs
- ✅ Validación de roles con middleware
- ✅ NextAuth.js v5 con JWT
- ✅ Variables de entorno protegidas
- ✅ Sanitización de inputs con Zod

## 🧪 Testing

### Testing Manual
```bash
# Probar endpoints
curl http://localhost:3000/api/products
curl http://localhost:3000/api/categories
```

### Testing Responsive
- Chrome DevTools (F12 → Toggle Device Toolbar)
- Dispositivos: iPhone SE, iPad, Desktop
- Breakpoints: 480px, 768px, 1024px

## 🐛 Troubleshooting

### Error: "Prisma Client no generado"
```bash
npx prisma generate
```

### Error: "No se puede conectar a la base de datos"
```bash
# Verificar PostgreSQL está corriendo
# Verificar DATABASE_URL en .env
npx prisma db push
```

### Error: "NEXTAUTH_SECRET no definido"
```bash
# Generar secret
openssl rand -base64 32
# Agregar a .env como AUTH_SECRET
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🏆 Características Destacadas

### v6.0 - Sistema Completo (Actual)
- ✅ Transbank Webpay Plus integrado
- ✅ Chilexpress API para envíos
- ✅ Guest Checkout sin registro
- ✅ Panel Admin 100% responsive
- ✅ Next.js 15 + TypeScript
- ✅ Prisma + PostgreSQL
- ✅ NextAuth.js v5

### Fases Anteriores
- ✅ Sistema de autenticación con roles
- ✅ Panel de administración completo
- ✅ Sistema de inventario y ventas
- ✅ Diseño responsive mobile-first
- ✅ Sistema de reviews y recomendaciones
- ✅ Comparador de productos
- ✅ Motor de búsqueda avanzado

---

⭐ **E-commerce profesional con todas las características necesarias para producción** 🚀  
💳 **Pagos seguros** | 🚚 **Envíos automáticos** | 📱 **100% Responsive** | 🔐 **Seguro**

## 📞 Contacto

Para consultas sobre el proyecto:
- Email: contacto@example.com
- GitHub: [@tu-usuario](https://github.com/tu-usuario)

---

**Desarrollado con ❤️ usando Next.js y las mejores prácticas de desarrollo web**
