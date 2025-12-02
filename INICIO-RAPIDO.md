# 🚀 INICIO RÁPIDO - EVALUACIÓN FINAL

## Comandos de Evaluación

### Para el Profesor - Verificar el Proyecto

```bash
# 1. Cambiar a la rama de evaluación
git checkout eval-final

# 2. Levantar toda la aplicación
docker-compose up -d

# 3. Verificar que todo está corriendo
docker-compose ps
```

**Resultado esperado:**
```
NAME              STATUS                    PORTS
izacas-backend    Up                        0.0.0.0:3001->3001/tcp
izacas-database   Up (healthy)              0.0.0.0:5434->5432/tcp
izacas-frontend   Up                        0.0.0.0:3000->3000/tcp
izacas-pgadmin    Up                        0.0.0.0:5050->80/tcp
```

---

## 🌐 URLs de Acceso

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Frontend** | http://localhost:3000 | - |
| **Backend** | http://localhost:3001/health | - |
| **PgAdmin** | http://localhost:5050 | admin@izacas.com / admin123 |

---

## 🗄️ Acceso a Base de Datos

**Desde PgAdmin (http://localhost:5050):**
1. Login: `admin@izacas.com` / `admin123`
2. Add New Server:
   - Name: `IZA&CAS DB`
   - Host: `database` (nombre del contenedor)
   - Port: `5432`
   - Username: `postgres`
   - Password: `admin123`
   - Database: `iza&cas`

**Desde herramienta externa:**
- Host: `localhost`
- Port: `5434`
- Username: `postgres`
- Password: `admin123`
- Database: `iza&cas`

---

## 👤 Usuario Administrador

Para acceder al panel de administración:

**URL:** http://localhost:3000/login

**Credenciales:**
- Email: `admin@example.com`
- Password: `Admin123!`

**Panel Admin:** http://localhost:3000/admin

---

## 📊 Verificación Rápida

### Ver logs en tiempo real
```bash
docker-compose logs -f
```

### Ver logs de un servicio específico
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database
```

### Verificar base de datos
```bash
docker-compose exec database psql -U postgres -d "iza&cas" -c "SELECT COUNT(*) FROM products;"
```

**Resultado esperado:** 80 productos

---

## 🛑 Detener la Aplicación

```bash
# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (resetear BD)
docker-compose down -v
```

---

## 📋 Componentes Incluidos

✅ **PostgreSQL 16** - Base de datos relacional  
✅ **PgAdmin 4** - Interfaz web de administración  
✅ **Backend API** - Next.js + Express + Prisma  
✅ **Frontend Web** - Next.js 15 + React 19  

---

## ✨ Datos de Prueba

La aplicación incluye:
- ✅ 7 categorías de productos
- ✅ 80 productos con imágenes
- ✅ Usuario administrador configurado
- ✅ Banners de ejemplo
- ✅ Base de datos completamente funcional

---

## 📄 Documentación Completa

Ver archivo: **EVALUACION-FINAL.md** para documentación detallada.

---

**Estado:** ✅ **LISTO PARA EVALUACIÓN**  
**Rama:** `eval-final`  
**Fecha:** 2 de diciembre de 2025
