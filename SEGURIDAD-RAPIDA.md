# 🔒 GUÍA RÁPIDA DE SEGURIDAD - IZA&CAS

## ⚡ ACCIONES INMEDIATAS (Hoy - Antes de cualquier deploy)

### 1️⃣ Proteger Variables de Entorno
```bash
# Verificar que .env NO esté en Git
git status | grep .env

# Si aparece .env, NUNCA hacer commit
# Agregarlo a .gitignore inmediatamente
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env*.local" >> .gitignore

# Si ya lo subiste, ROTAR todos los secretos:
# - Cambiar DATABASE_URL
# - Generar nuevo AUTH_SECRET
# - Cambiar contraseñas de base de datos
```

### 2️⃣ Generar Secretos Fuertes
```bash
# AUTH_SECRET (copiar al .env)
openssl rand -base64 64

# O con Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

### 3️⃣ Crear .env.example
Ya creado en el proyecto. Verificar que contenga solo ejemplos, NO valores reales.

### 4️⃣ Implementar Rate Limiting Básico

**En cualquier API crítica** (login, register, etc):

```typescript
// Ejemplo: src/app/api/auth/register/route.ts
import { checkRateLimit, RateLimitPresets } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limiting: 5 intentos por 15 minutos
  const { allowed, remaining, resetTime } = checkRateLimit(
    request,
    RateLimitPresets.AUTH.limit,
    RateLimitPresets.AUTH.windowMs
  );
  
  if (!allowed) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Espera 15 minutos.' },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Remaining': '0'
        }
      }
    );
  }
  
  // ... resto del código
}
```

### 5️⃣ Agregar Encabezados de Seguridad

Actualizar `src/middleware.ts`:

```typescript
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Encabezados de seguridad
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains'
    );
  }

  // ... resto del código existente
  
  return response;
}
```

---

## 🚀 SIGUIENTE PASO (Esta semana)

### 6️⃣ Validar Inputs con Esquemas Seguros

```typescript
// Usar los esquemas de src/lib/validation.ts
import { registerUserSchema } from '@/lib/validation';

const result = registerUserSchema.safeParse(body);
if (!result.success) {
  return NextResponse.json(
    { error: 'Datos inválidos', details: result.error.flatten() },
    { status: 400 }
  );
}
```

### 7️⃣ Auditar Dependencias

```bash
# Revisar vulnerabilidades
npm audit

# Corregir automáticamente
npm audit fix

# Si hay vulnerabilidades críticas que no se pueden auto-corregir
npm audit fix --force
```

---

## 📋 CHECKLIST MÍNIMO ANTES DE PRODUCCIÓN

- [ ] ✅ `.env` en `.gitignore`
- [ ] ✅ Secretos fuertes generados
- [ ] ✅ `.env.example` creado (sin valores reales)
- [ ] ✅ Rate limiting implementado en login/register
- [ ] ✅ Encabezados de seguridad agregados
- [ ] ✅ `npm audit` ejecutado y vulnerabilidades corregidas
- [ ] ✅ HTTPS configurado en producción
- [ ] ✅ Contraseñas de BD cambiadas a valores fuertes
- [ ] ✅ Variables de entorno configuradas en servidor

---

## 🆘 SI YA SUBISTE .env A GIT

### ACCIÓN INMEDIATA:

1. **NO ELIMINAR el archivo del commit** (queda en historial)
2. **Rotar TODAS las credenciales inmediatamente**:
   ```bash
   # Generar nuevos secretos
   openssl rand -base64 64  # Para AUTH_SECRET
   
   # Cambiar contraseña de PostgreSQL
   psql -U postgres
   ALTER USER izacas_user PASSWORD 'nueva_contraseña_fuerte';
   ```

3. **Actualizar .env con nuevas credenciales**

4. **Agregar .env a .gitignore**:
   ```bash
   echo ".env" >> .gitignore
   git add .gitignore
   git commit -m "chore: add .env to gitignore"
   git push
   ```

5. **Considerar hacer el repositorio privado** si es posible

6. **Cambiar secretos en el servidor de producción** (si ya está desplegado)

---

## 🔍 VERIFICACIÓN RÁPIDA

```bash
# ¿Está .env en .gitignore?
grep "^\.env$" .gitignore

# ¿Qué archivos están siendo trackeados por Git?
git ls-files | grep env

# Si aparece .env en la salida anterior, PROBLEMA!
```

---

## 📞 RECURSOS DE AYUDA

- **Reporte completo**: Ver `REPORTE-SEGURIDAD-MEJORAS.md`
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **NextAuth Docs**: https://next-auth.js.org/configuration/options
- **Next.js Security**: https://nextjs.org/docs/advanced-features/security-headers

---

## ⏱️ TIEMPO ESTIMADO

- **Proteger variables de entorno**: 10 minutos
- **Generar secretos fuertes**: 5 minutos
- **Implementar rate limiting**: 30 minutos
- **Agregar encabezados**: 10 minutos
- **Auditar dependencias**: 15 minutos

**TOTAL: ~1 hora** para lo crítico

---

**🎯 Recuerda**: No desplegar a producción sin completar al menos el checklist mínimo.
