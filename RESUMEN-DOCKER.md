# 🎯 RESUMEN EJECUTIVO - Docker IZA&CAS

## 📍 Respuesta a tu Pregunta: "¿Dónde está cada parte?"

### 🎨 **FRONTEND** (Lo que ve el usuario)
```
📁 UBICACIÓN: src/app/ + src/components/

src/app/                    👉 Páginas y rutas
├── page.tsx               👉 Página principal
├── products/              👉 Páginas de productos
├── admin/                 👉 Panel de administración
└── cart/                  👉 Carrito

src/components/            👉 Componentes visuales
├── Header.tsx
├── Footer.tsx
├── Banner.tsx
├── ProductCard.tsx
└── ...
```

### 🔧 **BACKEND** (APIs y lógica)
```
📁 UBICACIÓN: src/app/api/

src/app/api/
├── products/              👉 APIs de productos
├── categories/            👉 APIs de categorías
├── banners/               👉 APIs de banners
└── admin/                 👉 APIs de administración
    ├── stats/
    ├── products/
    ├── categories/
    ├── banners/
    └── orders/
```

### 🗄️ **BASE DE DATOS** (PostgreSQL)
```
📁 UBICACIÓN: prisma/

prisma/
├── schema.prisma         👉 Definición de tablas
├── migrations/           👉 Historial de cambios
└── seeders/              👉 Datos iniciales
```

---

## 🐳 **Configuración Docker Creada**

He generado **7 archivos** para Docker:

### ✅ Archivos Principales
1. **`Dockerfile`** - Imagen de Next.js (frontend + backend juntos)
2. **`docker-compose.yml`** - Orquestación de servicios
3. **`.dockerignore`** - Archivos a ignorar
4. **`.env.example`** - Variables de entorno

### 📚 Documentación
5. **`README-DOCKER.md`** - Guía completa paso a paso
6. **`UBICACION-ARCHIVOS.md`** - Mapa detallado del proyecto
7. **`ARQUITECTURA-DOCKER.md`** - Explicación de la arquitectura

### 🚀 Scripts de Inicio
8. **`start-docker.ps1`** - Inicio rápido para Windows
9. **`start-docker.sh`** - Inicio rápido para Linux/Mac

---

## 🏗️ **Arquitectura: 2 Contenedores**

```
┌─────────────────────────────────────┐
│  🐳 CONTENEDOR 1: app              │
│                                     │
│  🎨 Frontend (React/Next.js)       │
│  +                                  │
│  🔧 Backend (API Routes)           │
│                                     │
│  Puerto: 3000                       │
└────────────┬────────────────────────┘
             │
             │ Conexión TCP
             │
┌────────────▼────────────────────────┐
│  🐳 CONTENEDOR 2: database         │
│                                     │
│  🗄️ PostgreSQL 16                  │
│                                     │
│  Puerto: 5432                       │
└─────────────────────────────────────┘
```

### ⚠️ IMPORTANTE:
**No se puede separar fácilmente frontend/backend** porque:
- Next.js es un framework **full-stack integrado**
- Las API Routes están en el **mismo servidor**
- Comparten código y configuración

---

## 🚀 **Comandos para Iniciar**

### Opción 1: Script Automático (Recomendado)
```powershell
# Windows PowerShell
.\start-docker.ps1
```

### Opción 2: Manual
```bash
# 1. Levantar contenedores
docker-compose up -d

# 2. Ver logs
docker-compose logs -f app

# 3. Sembrar datos
docker-compose exec app npx tsx prisma/seeders/seed-real-products.ts
docker-compose exec app npx tsx prisma/seeders/seed-banners.ts
```

### Accesos:
- 🌐 **Aplicación**: http://localhost:3000
- 👨‍💼 **Admin**: http://localhost:3000/admin
- 🐘 **PgAdmin**: http://localhost:5050

---

## 📊 **¿Qué hay en cada contenedor?**

### Contenedor `app` (Next.js Full-Stack)
```
✅ Frontend:
   - Páginas React
   - Componentes
   - Estilos
   - Hooks
   - Context

✅ Backend:
   - API Routes (/api/*)
   - Prisma Client
   - Lógica de negocio
   - Autenticación (futura)

✅ Archivos estáticos:
   - Imágenes (/public/images)
   - Banners
   - Logos
```

### Contenedor `database` (PostgreSQL)
```
✅ Base de datos:
   - Tablas (banners, products, categories, users, orders, etc.)
   - Relaciones
   - Índices
   - Datos persistentes

✅ Volumen:
   - postgres_data (los datos no se pierden al reiniciar)
```

---

## 🔥 **Comandos Más Usados**

```bash
# Iniciar todo
docker-compose up -d

# Ver estado
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f app

# Detener todo
docker-compose down

# Reiniciar un servicio
docker-compose restart app

# Entrar al contenedor
docker-compose exec app sh

# Ejecutar comandos de Prisma
docker-compose exec app npx prisma studio
docker-compose exec app npx prisma migrate dev

# Backup de base de datos
docker-compose exec database pg_dump -U izacas izacas > backup.sql

# Restaurar backup
docker-compose exec -T database psql -U izacas izacas < backup.sql

# Limpiar todo (⚠️ BORRA DATOS)
docker-compose down -v
docker system prune -a
```

---

## 🎓 **Conceptos Clave**

### ¿Por qué 2 contenedores y no 3?
- **Next.js es full-stack**: Frontend y backend en uno
- **Separar sería contraproducente**: Más complejo, menos eficiente
- **Es el estándar**: Así es como se despliega Next.js en producción

### ¿Dónde está la base de datos?
- **Físicamente**: Contenedor Docker independiente
- **Conexión**: El contenedor `app` se conecta a `database` vía red interna
- **Persistencia**: Volumen `postgres_data` guarda los datos

### ¿Y las imágenes de productos?
- **Ubicación**: Carpeta `public/images/`
- **Servidas por**: Next.js (contenedor `app`)
- **Acceso**: http://localhost:3000/images/...

---

## 📝 **Checklist de Implementación**

- [x] Dockerfile creado (multi-stage build optimizado)
- [x] docker-compose.yml con 2 servicios + pgadmin
- [x] .dockerignore para optimizar build
- [x] next.config.ts configurado para standalone output
- [x] .env.example con variables necesarias
- [x] Scripts de inicio (PowerShell y Bash)
- [x] Documentación completa (3 archivos MD)
- [x] Configuración de red interna
- [x] Volumen persistente para PostgreSQL
- [x] Healthcheck para base de datos
- [x] Comandos de migración automáticos

---

## 🆘 **Problemas Comunes**

### Error: Puerto 3000 ya en uso
```bash
# Ver qué está usando el puerto
netstat -ano | findstr :3000

# Matar el proceso (Windows)
taskkill /PID <número> /F
```

### Error: Puerto 5432 ya en uso (PostgreSQL local)
```bash
# Opción 1: Detener PostgreSQL local
net stop postgresql-x64-16

# Opción 2: Cambiar puerto en docker-compose.yml
ports:
  - "5433:5432"  # Usar 5433 en lugar de 5432
```

### No se ven las imágenes
```bash
# Las imágenes deben estar en:
public/images/...

# Y accederse como:
/images/actividad/camping/...
```

---

## 🎯 **Próximos Pasos Recomendados**

1. **Probar Docker localmente**
   ```bash
   .\start-docker.ps1
   ```

2. **Verificar que todo funciona**
   - Abrir http://localhost:3000
   - Probar panel admin
   - Crear un banner nuevo

3. **Si todo está bien:**
   - Hacer commit de los archivos Docker
   - Preparar para deploy en servidor

4. **Para producción:**
   - Configurar dominio
   - Agregar SSL/TLS
   - Optimizar imágenes
   - Configurar backups automáticos

---

## 💡 **Alternativa: Solo BD en Docker**

Si prefieres desarrollar **sin Docker** para Next.js (más rápido):

```bash
# 1. Levantar solo PostgreSQL
docker-compose up database -d

# 2. Ejecutar Next.js localmente
npm run dev
```

**Ventajas:**
- ✅ Hot reload más rápido
- ✅ Mejor debug
- ✅ Menos consumo de recursos

**Desventaja:**
- ❌ No replica exactamente el entorno de producción

---

¿Necesitas ayuda para configurar algo más o tienes dudas específicas? 🚀
