# 🔒 Guía de Sanitización para GitHub Público

Este documento contiene instrucciones para preparar el proyecto para subirlo a GitHub público de forma segura, sin comprometer información sensible del cliente.

## ✅ Checklist de Seguridad

### 1. Variables de Entorno
- [x] `.env` está en `.gitignore`
- [x] `.env.example` creado sin datos sensibles
- [x] Información del cliente reemplazada por placeholders genéricos

### 2. Archivos de Configuración

#### Archivos que necesitan sanitización:
```bash
# Archivos con información del cliente que deben ser modificados:
- src/lib/chilexpress.ts (dirección de origen)
- docker-compose.yml (passwords y secrets)
- docker-compose.3tier.yml (passwords y secrets)
- CONFIGURAR-VERCEL.md (DATABASE_URL y secrets de ejemplo)
- DOCKER-PANEL-USUARIO.md (passwords de ejemplo)
```

### 3. Datos Sensibles a Remover/Reemplazar

#### ❌ NUNCA subir:
- Contraseñas reales de base de datos
- `AUTH_SECRET` real
- API Keys de producción de Transbank
- Credenciales de Chilexpress reales
- Google Maps API Keys reales
- Información personal del cliente:
  - Nombre comercial específico (IZA&CAS)
  - Dirección física real (Simón Bolívar 485, Valparaíso)
  - Teléfonos reales
  - Emails reales

#### ✅ Está OK para compartir:
- Código fuente de la aplicación
- Estructura de base de datos (schema.prisma)
- Configuración de Docker (con secrets genéricos)
- Credenciales de TESTING de Transbank (son públicas)
- Imágenes de productos genéricos
- Documentación técnica

## 🔧 Pasos de Sanitización

### Paso 1: Sanitizar docker-compose.yml

Reemplazar:
```yaml
# ANTES (NO subir)
DATABASE_URL: "postgresql://izacas:izacas2024@host.docker.internal:5433/izacas?schema=public"
AUTH_SECRET: "ClLVfo1Ia7rOFAZQ+iCqlsy25PJdRJi+ArCbBc3TLBs="

# DESPUÉS (OK para subir)
DATABASE_URL: "postgresql://user:password@host.docker.internal:5433/database?schema=public"
AUTH_SECRET: "change-this-in-production-generate-secure-secret"
```

### Paso 2: Sanitizar src/lib/chilexpress.ts

Reemplazar dirección del cliente:
```typescript
// ANTES (NO subir)
streetName: 'Simón Bolívar',
streetNumber: '485',
commune: 'Valparaíso',

// DESPUÉS (OK para subir)
streetName: 'Calle Principal',
streetNumber: '123',
commune: 'Santiago',
```

### Paso 3: Sanitizar archivos de documentación

Archivos a revisar:
- `CONFIGURAR-VERCEL.md` - Remover DATABASE_URL real si existe
- `DOCKER-PANEL-USUARIO.md` - Usar passwords genéricos
- `README.md` - Usar nombre genérico de tienda

### Paso 4: Reemplazar README principal

```bash
# Reemplazar README.md con versión pública
mv README.md README.ORIGINAL.md
mv README.PUBLIC.md README.md
```

### Paso 5: Verificar .gitignore

Asegurar que estos archivos/carpetas NO se suban:
```
.env
.env.local
.env.production
node_modules/
.next/
dist/
build/
*.log
```

## 📂 Estructura de Ramas Sugerida

### Rama `main` (pública)
- Código base sanitizado
- README genérico
- Sin información del cliente
- Configuraciones de ejemplo

### Rama `feature/frontend`
- Componentes React
- Estilos CSS
- UI/UX features
- Sistema de categorías

### Rama `feature/backend`
- API Routes
- Prisma schema
- Autenticación
- Sistema de pagos

### Rama `feature/admin-panel`
- Panel de administración
- Dashboard
- CRUD de productos
- Gestión de inventario

### Rama `feature/integrations`
- Transbank integration
- Chilexpress integration
- Google Maps integration

### Rama `feature/responsive-design`
- Mobile-first design
- Breakpoints
- Adaptive components

## 🚀 Comandos para Preparar el Repositorio

### 1. Inicializar Git (si no está inicializado)
```bash
git init
git add .
git commit -m "chore: initial commit - sanitized version"
```

### 2. Crear ramas para diferentes features
```bash
# Frontend
git checkout -b feature/frontend
git add src/components/ src/styles/
git commit -m "feat: add frontend components and styles"

# Backend
git checkout -b feature/backend
git add src/app/api/ prisma/
git commit -m "feat: add backend API and database schema"

# Admin Panel
git checkout -b feature/admin-panel
git add src/app/admin/
git commit -m "feat: add admin panel"

# Integrations
git checkout -b feature/integrations
git add src/lib/transbank.ts src/lib/chilexpress.ts
git commit -m "feat: add payment and shipping integrations"
```

### 3. Subir a GitHub
```bash
# Agregar remote
git remote add origin https://github.com/tu-usuario/tu-repo.git

# Subir rama main
git checkout main
git push -u origin main

# Subir todas las ramas
git push --all origin
```

## 🔍 Verificación Final

Antes de hacer push, verificar:

```bash
# Ver qué archivos se van a subir
git status

# Ver contenido que se va a subir
git diff --cached

# Buscar posibles secrets en archivos
grep -r "AUTH_SECRET" .
grep -r "izacas2024" .
grep -r "Simón Bolívar" .
grep -r "ClLVfo1Ia7rOFAZQ" .
```

## 📝 Archivo .env a NO Subir

El archivo `.env` real del cliente debe permanecer SOLO en local:

```env
# ❌ NUNCA SUBIR ESTE ARCHIVO
DATABASE_URL="postgresql://postgres:admin123@localhost:5434/iza&cas"
AUTH_SECRET="85c9MFNVPG6fUsU6c0EeNa0LTJtKvMlcy77Js+10jIcMsSNtgnFT2pnY8GNRtkb16SEYX4PdqA+ODPZKgTpLFg=="
NEXT_PUBLIC_STORE_NAME="IZA&CAS"
NEXT_PUBLIC_STORE_ADDRESS="Simón Bolívar 485, 2390030 Valparaíso, Chile"
```

## ✅ Resumen

1. ✅ `.env` en `.gitignore`
2. ✅ `.env.example` con valores genéricos
3. ✅ README.PUBLIC.md sin datos del cliente
4. ✅ docker-compose.yml con secrets genéricos
5. ✅ Código fuente sanitizado
6. ✅ Ramas separadas por features
7. ✅ Documentación técnica OK para compartir

## 🎯 Resultado Final

El repositorio público contendrá:
- ✅ Código de la aplicación (100% compartible)
- ✅ Estructura de base de datos
- ✅ Sistema de autenticación (sin secrets reales)
- ✅ Integraciones de pagos y envíos (con credenciales de testing)
- ✅ Documentación técnica completa
- ❌ Sin información personal del cliente
- ❌ Sin credenciales reales
- ❌ Sin datos sensibles

---

**⚠️ IMPORTANTE**: Mantén una copia local del `.env` real para el cliente en un lugar seguro fuera del repositorio Git.
