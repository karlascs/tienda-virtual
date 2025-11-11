# ✅ BASE DE DATOS COMPLETAMENTE CARGADA

## 📊 Resumen de Datos

### Categorías (7)
1. ✅ **Juguetes** - 6 productos
2. ✅ **Tecnología** - 6 productos
3. ✅ **Hogar** - 4 productos
4. ✅ **Electrohogar** - 4 productos
5. ✅ **Cuidado Personal** - 4 productos
6. ✅ **Herramientas** - 4 productos
7. ✅ **Actividad** - 4 productos

### Total de Productos: 32

### Usuario Administrador
- ✅ **Email:** admin@izacas.com
- ✅ **Contraseña:** admin123
- ✅ **Rol:** ADMIN
- ✅ **Nombre:** Administrador IZA&CAS

---

## 🚀 Accesos Disponibles

### 1. Frontend (Tienda)
```
URL: http://localhost:3000
```
- Ver catálogo completo de productos
- Navegar por categorías
- Ver detalles de productos
- Agregar al carrito

### 2. Panel de Administración
```
URL: http://localhost:3000/login
Email: admin@izacas.com
Contraseña: admin123
```
Después del login, acceder a:
```
URL: http://localhost:3000/admin
```

### 3. pgAdmin (Gestión de Base de Datos)
```
URL: http://localhost:5050
Email: admin@izacas.com
Contraseña: admin123
```

**Configuración de Servidor:**
- Host: `database` (interno) o `localhost` (externo)
- Puerto: `5432` (interno) o `5434` (externo)
- Base de datos: `iza&cas`
- Usuario: `postgres`
- Contraseña: `admin123`

### 4. Prisma Studio (Editor Visual de BD)
```bash
docker-compose -f docker-compose.3tier.yml exec backend npx prisma studio
```
Luego abrir: `http://localhost:5555`

---

## 📦 Algunos Productos Cargados

### Juguetes (6)
- Carpa Casita de Princesa - $25,990
- Carpa de Castillo Infantil - $27,990
- Carpa Túnel - $22,990
- Balón de Fútbol Air Power - $15,990
- Set de Cocina Kitchen - $32,990
- Mega Bloks 80 Piezas - $18,990

### Tecnología (6)
- Proyector Astronauta Infantil - $35,990
- Audífonos Inalámbricos IRM - $28,990
- Cámara de Seguridad 360° - $42,990
- Mini Cámara Espía HD - $24,990
- Cable USB Tipo C 3 Metros - $8,990
- Reloj Inteligente Smart Watch - $45,990

### Hogar (4)
- Set de Organizadores para Closet - $12,990
- Lámpara LED de Mesa - $19,990
- Cojines Decorativos Set x4 - $16,990
- Espejo de Pared Decorativo - $34,990

### Electrohogar (4)
- Aspiradora Robot Inteligente - $89,990
- Licuadora de Alta Potencia - $42,990
- Freidora de Aire 5L - $69,990
- Cafetera Express - $54,990

### Cuidado Personal (4)
- Secador de Pelo Profesional - $32,990
- Plancha de Pelo Cerámica - $28,990
- Afeitadora Eléctrica 3 Cabezales - $38,990
- Set de Pedicure Eléctrico - $19,990

### Herramientas (4)
- Taladro Inalámbrico 20V - $59,990
- Set de Herramientas 120 Piezas - $45,990
- Soldador Eléctrico 60W - $16,990
- Escalera Telescópica Aluminio - $89,990

### Actividad (4)
- Bicicleta Estática Plegable - $89,990
- Set de Pesas Ajustables 20kg - $79,990
- Colchoneta de Yoga Premium - $18,990
- Cuerda para Saltar Digital - $12,990

---

## 🔧 Comandos Útiles

### Verificar Estado
```bash
# Ver servicios corriendo
docker-compose -f docker-compose.3tier.yml ps

# Ver datos en la BD
docker-compose -f docker-compose.3tier.yml exec backend node check-db.js
```

### Gestión de Servicios
```bash
# Detener todo
docker-compose -f docker-compose.3tier.yml down

# Levantar todo
docker-compose -f docker-compose.3tier.yml up -d

# Ver logs
docker-compose -f docker-compose.3tier.yml logs -f
```

### Re-cargar Datos
```bash
# Si necesitas volver a cargar productos
docker cp seed-full.js izacas-backend:/app/seed-full.js
docker-compose -f docker-compose.3tier.yml exec backend node seed-full.js
```

---

## ✅ Todo Listo Para Evaluación

- ✅ 7 Categorías con productos
- ✅ 32 Productos con precios, stock y descripciones
- ✅ Usuario Admin creado
- ✅ Base de datos "iza&cas" poblada
- ✅ Arquitectura 3 capas funcionando
- ✅ pgAdmin configurado
- ✅ Prisma Studio disponible
- ✅ Frontend mostrando productos
- ✅ Panel Admin accesible

🎉 **¡La tienda está completamente funcional!**
