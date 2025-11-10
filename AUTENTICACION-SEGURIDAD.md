# 🔐 Sistema de Autenticación y Seguridad - IZA&CAS

## ✅ Sistema Completado

Tu tienda ahora tiene un **sistema de autenticación completo y seguro** con:

- ✅ Login y registro de usuarios
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Roles (ADMIN y USER)
- ✅ Sesiones seguras con NextAuth.js v5
- ✅ Protección del panel de administración
- ✅ Protección contra ataques comunes

---

## 📋 Credenciales de Administrador

**Email:** `admin@izaycas.com`  
**Contraseña:** `Admin123!`

---

## 🎯 Funcionalidades Implementadas

### 1. **Páginas de Autenticación**

#### Login (`/login`)
- Formulario de inicio de sesión
- Validación de email y contraseña
- Mensajes de error claros
- Redirección automática después del login

#### Registro (`/register`)
- Formulario de creación de cuenta
- Validaciones:
  - Email válido
  - Contraseña mínimo 6 caracteres
  - Confirmación de contraseña
- Verificación de email duplicado
- Hash automático de contraseñas

### 2. **Roles de Usuario**

```typescript
enum UserRole {
  USER     // Usuario normal (puede comprar)
  ADMIN    // Administrador (acceso al panel)
}
```

### 3. **Protección de Rutas**

#### Rutas Públicas (sin login)
- `/` - Página principal
- `/login` - Iniciar sesión
- `/register` - Crear cuenta
- `/products/*` - Ver productos

#### Rutas Protegidas (requiere login)
- `/cart` - Carrito de compras
- `/orders` - Mis órdenes

#### Rutas de Administrador (requiere role=ADMIN)
- `/admin` - Panel de administración
- `/admin/products` - Gestión de productos
- `/admin/categories` - Gestión de categorías
- `/admin/banners` - Gestión de banners
- `/admin/orders` - Gestión de órdenes

---

## 🔒 Medidas de Seguridad Implementadas

### 1. **Hash de Contraseñas**
```typescript
// NO se guardan contraseñas en texto plano
// Se usa bcrypt con salt rounds = 10
const hashedPassword = await bcrypt.hash(password, 10);
```

**✅ Protege contra:** Robo de base de datos

### 2. **JWT con NextAuth.js**
```typescript
// Tokens firmados criptográficamente
// Expiración automática después de 30 días
// Secret key seguro en .env
```

**✅ Protege contra:** Falsificación de sesiones

### 3. **Middleware de Autorización**
```typescript
// Verifica role antes de permitir acceso
// Redirección automática si no autorizado
// Validación en cada request
```

**✅ Protege contra:** Acceso no autorizado al admin

### 4. **Validación con Zod**
```typescript
// Validación de tipos en tiempo de ejecución
// Sanitización de inputs
// Mensajes de error específicos
```

**✅ Protege contra:** SQL Injection, XSS

### 5. **Prisma ORM**
```typescript
// Queries parametrizadas automáticamente
// Prevención de SQL injection nativa
```

**✅ Protege contra:** SQL Injection

### 6. **Variables de Entorno Seguras**
```bash
# Secrets NUNCA se suben a git
# .env en .gitignore
AUTH_SECRET=<generado automáticamente>
DATABASE_URL=<con credenciales>
```

**✅ Protege contra:** Exposición de credenciales

---

## 🛡️ Protecciones Adicionales Recomendadas

### Para Producción (siguiente fase):

#### 1. **Rate Limiting**
```typescript
// Limitar intentos de login
// Prevenir fuerza bruta
import rateLimit from 'express-rate-limit';
```

#### 2. **HTTPS Obligatorio**
```typescript
// Encriptar todas las comunicaciones
// Certificado SSL/TLS
```

#### 3. **CORS Configurado**
```typescript
// Permitir solo dominios autorizados
// Headers de seguridad
```

#### 4. **2FA (Autenticación de 2 Factores)**
```typescript
// Email de confirmación
// SMS o app de autenticación
```

#### 5. **Logging de Seguridad**
```typescript
// Registrar intentos fallidos
// Alertas de actividad sospechosa
```

---

## 🚀 Cómo Usar el Sistema

### 1. **Crear Usuario Admin (Ya hecho)**

```powershell
cd tienda-next
npx tsx prisma/seeders/seed-admin.ts
```

✅ Ya ejecutado - Usuario admin creado

### 2. **Iniciar Sesión como Admin**

1. Ve a `http://localhost:3000`
2. Haz clic en **"Iniciar Sesión"**
3. Ingresa:
   - Email: `admin@izaycas.com`
   - Contraseña: `Admin123!`
4. Verás el menú **"Admin Panel"** en el header

### 3. **Registrar Usuario Normal**

1. Ve a `http://localhost:3000/register`
2. Completa el formulario:
   - Nombre completo
   - Email único
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña
3. Se creará con `role: USER` automáticamente

### 4. **Cerrar Sesión**

1. Haz clic en tu nombre en el header
2. Selecciona **"Cerrar Sesión"**

---

## 📂 Archivos Importantes

### Configuración de Autenticación
```
src/
  auth.ts                     # ⚙️ Configuración NextAuth.js
  middleware.ts               # 🛡️ Protección de rutas
  
  app/
    login/
      page.tsx                # 🔓 Página de login
    register/
      page.tsx                # ✍️ Página de registro
    
    api/
      auth/
        [...nextauth]/
          route.ts            # 🔌 API de NextAuth
        register/
          route.ts            # 📝 API de registro

  components/
    Header.tsx                # 🔝 Menu con autenticación
```

### Schema de Base de Datos
```prisma
model User {
  id              String     @id @default(cuid())
  name            String
  email           String     @unique
  hashedPassword  String     # ← Hash bcrypt
  role            UserRole   @default(USER)  # ← ADMIN o USER
  emailVerified   DateTime?
  avatar          String?
  
  // Relaciones
  carts           Cart[]
  orders          Order[]
  reviews         Review[]
  wishlists       Wishlist[]
}

enum UserRole {
  USER
  ADMIN
}
```

---

## 🧪 Testing del Sistema

### Test 1: Login Exitoso
```
1. Ve a /login
2. Ingresa admin@izaycas.com / Admin123!
3. ✅ Debe redirigir a /
4. ✅ Debe mostrar "Admin Panel" en header
```

### Test 2: Login Fallido
```
1. Ve a /login
2. Ingresa email@falso.com / wrongpass
3. ✅ Debe mostrar "Credenciales inválidas"
4. ✅ No debe permitir acceso
```

### Test 3: Registro
```
1. Ve a /register
2. Completa formulario con datos válidos
3. ✅ Debe crear usuario con role=USER
4. ✅ Debe hacer login automáticamente
```

### Test 4: Protección Admin
```
1. Cierra sesión
2. Intenta ir a /admin
3. ✅ Debe redirigir a /login
4. Login como USER normal
5. Intenta ir a /admin
6. ✅ Debe redirigir a /login (no es admin)
```

### Test 5: Sesión Persistente
```
1. Login como admin
2. Cierra la pestaña
3. Abre nueva pestaña en http://localhost:3000
4. ✅ Debe seguir logueado (sesión guardada)
```

---

## 🔧 Comandos Útiles

### Crear nuevo usuario admin desde código
```typescript
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const hashedPassword = await bcrypt.hash("NuevaContraseña123!", 10);

await prisma.user.create({
  data: {
    name: "Nuevo Admin",
    email: "nuevo@admin.com",
    hashedPassword: hashedPassword,
    role: "ADMIN",
  },
});
```

### Ver todos los usuarios
```powershell
npx prisma studio
# Navega a la tabla "User"
```

### Cambiar rol de usuario existente
```typescript
await prisma.user.update({
  where: { email: "usuario@ejemplo.com" },
  data: { role: "ADMIN" },
});
```

### Resetear contraseña
```typescript
const newHashedPassword = await bcrypt.hash("NuevaContraseña", 10);

await prisma.user.update({
  where: { email: "usuario@ejemplo.com" },
  data: { hashedPassword: newHashedPassword },
});
```

---

## 📊 Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────────┐
│  1. Usuario Visita /login                                   │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Completa formulario (email + password)                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼ POST /api/auth/callback/credentials
┌─────────────────────────────────────────────────────────────┐
│  3. NextAuth.js ejecuta authorize() en auth.ts              │
│     - Valida formato con Zod                                │
│     - Busca usuario en BD                                   │
│     - Compara password con bcrypt.compare()                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Si válido: Genera JWT                                   │
│     - Incluye: id, name, email, role                        │
│     - Firma con AUTH_SECRET                                 │
│     - Expira en 30 días                                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Guarda token en cookie httpOnly                         │
│     - next-auth.session-token                               │
│     - Secure (solo HTTPS en producción)                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Redirección a página solicitada                         │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│  7. En cada request:                                        │
│     - middleware.ts intercepta                              │
│     - Verifica token JWT                                    │
│     - Si /admin/* verifica role=ADMIN                       │
│     - Permite o bloquea acceso                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Consideraciones de Seguridad

### ✅ LO QUE ESTÁ PROTEGIDO:
- ✅ Contraseñas hasheadas (no se pueden ver en BD)
- ✅ Panel admin solo para ADMIN
- ✅ Sesiones firmadas criptográficamente
- ✅ SQL injection prevenido por Prisma
- ✅ XSS prevenido por React (sanitización automática)
- ✅ Variables sensibles en .env (no en git)

### ⚠️ LO QUE AÚN FALTA (para producción):
- ⚠️ Rate limiting (prevenir fuerza bruta)
- ⚠️ HTTPS obligatorio
- ⚠️ Verificación de email
- ⚠️ Recuperación de contraseña
- ⚠️ 2FA opcional
- ⚠️ Logging de eventos de seguridad
- ⚠️ CORS configurado
- ⚠️ Headers de seguridad (helmet)

---

## 🆘 Problemas Comunes

### "Credenciales inválidas" siempre
**Solución:** Verifica que el usuario existe en BD
```powershell
npx prisma studio
# Verifica tabla User
```

### No aparece "Admin Panel" después de login
**Solución:** Verifica que el usuario tiene `role: ADMIN`
```sql
-- En Prisma Studio o SQL
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@izaycas.com';
```

### "AUTH_SECRET no definido"
**Solución:** Verifica archivo .env
```bash
AUTH_SECRET=tu_secret_aqui_minimo_32_caracteres
```

### Sesión no persiste
**Solución:** Verifica cookies en DevTools
- F12 → Application → Cookies
- Debe existir: `next-auth.session-token`

### Redirección infinita en /admin
**Solución:** Borra cookies y vuelve a hacer login
```javascript
// DevTools Console
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
```

---

## 📚 Recursos Adicionales

- [NextAuth.js v5 Docs](https://authjs.dev/)
- [Bcrypt Security Best Practices](https://github.com/kelektiv/node.bcrypt.js)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## ✅ Checklist de Seguridad

- [x] Contraseñas hasheadas con bcrypt
- [x] JWT firmado con secret seguro
- [x] Roles de usuario implementados
- [x] Middleware de protección
- [x] Validación de inputs con Zod
- [x] SQL injection prevenido (Prisma)
- [x] XSS prevenido (React)
- [x] Variables sensibles en .env
- [ ] Rate limiting (siguiente fase)
- [ ] HTTPS obligatorio (producción)
- [ ] Verificación de email (siguiente fase)
- [ ] 2FA opcional (siguiente fase)

---

🎉 **Sistema de autenticación completo y listo para usar!**

Para probar: Ve a `http://localhost:3000`, haz clic en **"Iniciar Sesión"** y usa:
- Email: `admin@izaycas.com`
- Contraseña: `Admin123!`
