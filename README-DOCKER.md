# 🐳 Guía Completa Docker - IZA&CAS E-commerce

## 📋 Resumen de la Arquitectura

Este proyecto usa **2 contenedores Docker**:

### 1️⃣ **database** - PostgreSQL 16
- **Puerto**: 5432
- **Usuario**: izacas
- **Contraseña**: izacas2024
- **Base de datos**: izacas
- **Volumen**: `postgres_data` (datos persistentes)

### 2️⃣ **app** - Next.js Full-Stack
- **Puerto**: 3000
- **Incluye**: Frontend + Backend API
- **Tecnologías**: React 19, Next.js 15, Prisma, TypeScript

### 3️⃣ **pgadmin** (Opcional) - Administrador de PostgreSQL
- **Puerto**: 5050
- **Email**: admin@izacas.com
- **Contraseña**: admin123

---

## 🚀 Instalación y Uso

### Prerrequisitos
- ✅ Docker Desktop instalado
- ✅ Docker Compose instalado
- ✅ Puerto 3000 y 5432 disponibles

### 1. Iniciar los Contenedores

```bash
# Construir y levantar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f app
```

**Proceso automático:**
1. ✅ Crea la base de datos PostgreSQL
2. ✅ Construye la imagen de Next.js
3. ✅ Ejecuta migraciones de Prisma
4. ✅ Inicia la aplicación en http://localhost:3000

### 2. Sembrar Datos Iniciales

```bash
# Ejecutar seeders dentro del contenedor
docker-compose exec app npx tsx prisma/seeders/seed-real-products.ts
docker-compose exec app npx tsx prisma/seeders/seed-banners.ts
```

### 3. Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **Panel Admin**: http://localhost:3000/admin
- **PgAdmin** (opcional): http://localhost:5050

---

## 🛠️ Comandos Útiles

### Gestión de Contenedores

```bash
# Ver estado de contenedores
docker-compose ps

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ BORRA LA BASE DE DATOS)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart app

# Ver logs de un servicio
docker-compose logs -f database
docker-compose logs -f app
```

### Reconstruir Imágenes

```bash
# Reconstruir después de cambios en código
docker-compose up --build -d

# Forzar reconstrucción sin caché
docker-compose build --no-cache
docker-compose up -d
```

### Acceder al Contenedor

```bash
# Entrar al contenedor de la app
docker-compose exec app sh

# Ejecutar comandos de Prisma
docker-compose exec app npx prisma studio
docker-compose exec app npx prisma migrate dev
docker-compose exec app npx prisma generate

# Entrar al contenedor de PostgreSQL
docker-compose exec database psql -U izacas -d izacas
```

---

## 🗄️ Base de Datos

### Conexión desde el Host (Local)

```bash
Host: localhost
Puerto: 5432
Usuario: izacas
Contraseña: izacas2024
Base de datos: izacas
```

**Connection String:**
```
postgresql://izacas:izacas2024@localhost:5432/izacas
```

### Conexión desde otros Contenedores

```bash
Host: database  # Nombre del servicio en docker-compose
Puerto: 5432
```

**Connection String:**
```
postgresql://izacas:izacas2024@database:5432/izacas
```

### Backup y Restore

```bash
# Crear backup
docker-compose exec database pg_dump -U izacas izacas > backup.sql

# Restaurar backup
docker-compose exec -T database psql -U izacas izacas < backup.sql
```

---

## 📊 Administración con PgAdmin

1. Accede a http://localhost:5050
2. Login:
   - Email: `admin@izacas.com`
   - Contraseña: `admin123`
3. Agregar servidor:
   - Host: `database`
   - Puerto: `5432`
   - Usuario: `izacas`
   - Contraseña: `izacas2024`

---

## 🔧 Desarrollo

### Modo Desarrollo con Hot Reload

Si prefieres desarrollar **SIN Docker** (más rápido):

```bash
# Levantar solo la base de datos
docker-compose up database -d

# Ejecutar Next.js localmente
npm run dev
```

Edita `.env` para apuntar a `localhost`:
```env
DATABASE_URL="postgresql://izacas:izacas2024@localhost:5432/izacas"
```

### Migraciones de Prisma

```bash
# Crear nueva migración
docker-compose exec app npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones
docker-compose exec app npx prisma migrate deploy

# Resetear base de datos
docker-compose exec app npx prisma migrate reset
```

---

## 🐛 Solución de Problemas

### Error: Puerto 3000 ya en uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error: Puerto 5432 ya en uso
Tienes PostgreSQL local corriendo. Opciones:
1. Detenerlo: `net stop postgresql-x64-16` (Windows)
2. Cambiar puerto en `docker-compose.yml`: `"5433:5432"`

### Contenedor no inicia - Ver logs
```bash
docker-compose logs -f app
docker-compose logs -f database
```

### Base de datos corrupta
```bash
docker-compose down -v  # ⚠️ Elimina todos los datos
docker-compose up -d
docker-compose exec app npx tsx prisma/seeders/seed-real-products.ts
```

### Error de migraciones
```bash
docker-compose exec app npx prisma migrate reset
docker-compose exec app npx prisma generate
```

---

## 📦 Volúmenes Docker

### Ver volúmenes
```bash
docker volume ls
```

### Inspeccionar volumen
```bash
docker volume inspect tienda-next_postgres_data
```

### Eliminar volúmenes huérfanos
```bash
docker volume prune
```

---

## 🚢 Despliegue en Producción

### Variables de Entorno

Crea un archivo `.env.production`:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXT_PUBLIC_API_URL=https://tu-dominio.com
NODE_ENV=production
```

### Build para Producción

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Optimizaciones

1. **Nginx como Reverse Proxy**
2. **SSL/TLS con Let's Encrypt**
3. **CDN para imágenes estáticas**
4. **Redis para caché**

---

## 📝 Estructura de Archivos Docker

```
tienda-next/
├── Dockerfile              # Imagen de Next.js (multi-stage)
├── docker-compose.yml      # Orquestación de servicios
├── .dockerignore          # Archivos a ignorar en build
├── next.config.ts         # Configuración con output: 'standalone'
└── prisma/
    ├── schema.prisma      # Modelos de base de datos
    └── migrations/        # Historial de cambios
```

---

## 🎯 Checklist de Inicio Rápido

- [ ] Docker Desktop instalado y corriendo
- [ ] Clonar/tener el proyecto
- [ ] `docker-compose up -d`
- [ ] Esperar 1-2 minutos a que inicie
- [ ] `docker-compose logs -f app` (verificar logs)
- [ ] Abrir http://localhost:3000
- [ ] `docker-compose exec app npx tsx prisma/seeders/seed-real-products.ts`
- [ ] `docker-compose exec app npx tsx prisma/seeders/seed-banners.ts`
- [ ] ✅ ¡Listo para usar!

---

## 🆘 Soporte

### Comandos de Diagnóstico

```bash
# Estado general
docker-compose ps
docker-compose logs --tail=50 app

# Salud de la base de datos
docker-compose exec database pg_isready -U izacas

# Conexión de red
docker network inspect tienda-next_izacas-network

# Espacio en disco
docker system df
```

### Reinicio Completo

```bash
# Parar todo
docker-compose down -v

# Limpiar imágenes antiguas
docker system prune -a

# Reiniciar Docker Desktop

# Volver a construir
docker-compose up --build -d
```

---

## ⚙️ Personalización

### Cambiar Puertos

Edita `docker-compose.yml`:

```yaml
services:
  app:
    ports:
      - "8080:3000"  # Cambia el puerto del host
  
  database:
    ports:
      - "5433:5432"  # Cambia el puerto de PostgreSQL
```

### Agregar Variables de Entorno

```yaml
services:
  app:
    environment:
      - TU_VARIABLE=valor
      - OTRA_VARIABLE=otro_valor
```

### Múltiples Entornos

```bash
# Desarrollo
docker-compose -f docker-compose.yml up -d

# Producción
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Testing
docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d
```

---

## 📚 Recursos Adicionales

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [Prisma Docker Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/docker)

---

¿Necesitas ayuda con algún paso específico? ¡Solo pregunta! 🚀
