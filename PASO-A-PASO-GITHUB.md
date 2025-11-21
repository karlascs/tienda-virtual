# 🚀 Guía Paso a Paso para Subir a GitHub Público

Esta guía te llevará paso a paso para subir tu proyecto a GitHub de forma segura.

## 📋 Pre-requisitos

- [ ] Git instalado
- [ ] Cuenta de GitHub
- [ ] PowerShell (Windows)
- [ ] Copia de seguridad del archivo `.env` original

---

## 🔒 Fase 1: Sanitización (CRÍTICO)

### Paso 1.1: Ejecutar script de sanitización

```powershell
.\sanitize-for-github.ps1
```

Este script:
- ✅ Verifica que `.env` está en `.gitignore`
- ✅ Crea respaldo del README original
- ✅ Reemplaza README con versión pública
- ✅ Busca datos sensibles en archivos
- ✅ Genera reporte de seguridad

### Paso 1.2: Revisar archivos marcados

Si el script encuentra datos sensibles, revísalos manualmente y sanitízalos.

**Archivos críticos a revisar:**
- `docker-compose.yml` - Passwords y secrets
- `docker-compose.3tier.yml` - Passwords y secrets
- `src/lib/chilexpress.ts` - Dirección de origen
- Cualquier archivo `.md` con información del cliente

### Paso 1.3: Sanitizar manualmente si es necesario

**Reemplazar en docker-compose.yml:**
```yaml
# ANTES (NO subir)
POSTGRES_PASSWORD: admin123
AUTH_SECRET: "ClLVfo1Ia7rOFAZQ+iCqlsy25PJdRJi+ArCbBc3TLBs="

# DESPUÉS (OK para subir)
POSTGRES_PASSWORD: your-password-here
AUTH_SECRET: "your-secret-here-generate-one"
```

**Reemplazar en src/lib/chilexpress.ts:**
```typescript
// ANTES (NO subir)
streetName: 'Simón Bolívar',
streetNumber: '485',

// DESPUÉS (OK para subir)
streetName: 'Calle Principal',
streetNumber: '123',
```

---

## 🌿 Fase 2: Crear Repositorio Git Local

### Paso 2.1: Inicializar Git (si no está inicializado)

```powershell
# Verificar si ya está inicializado
if (Test-Path ".git") {
    Write-Host "✅ Git ya está inicializado"
} else {
    git init
    Write-Host "✅ Git inicializado"
}
```

### Paso 2.2: Verificar archivos a subir

```powershell
# Ver qué archivos se van a incluir
git status
```

**Verificar que NO aparezcan:**
- ❌ `.env` (debe estar en .gitignore)
- ❌ `node_modules/` (debe estar en .gitignore)
- ❌ `.next/` (debe estar en .gitignore)

### Paso 2.3: Hacer commit inicial

```powershell
# Agregar todos los archivos
git add .

# Crear commit inicial
git commit -m "chore: initial commit - sanitized version for public repo"
```

---

## 🌳 Fase 3: Crear Estructura de Ramas

### Paso 3.1: Asegurar que estás en rama main

```powershell
git branch -M main
```

### Paso 3.2: Ejecutar script de creación de ramas

```powershell
.\create-branches.ps1
```

Esto creará 12 ramas de features:
- ✅ `feature/frontend-components`
- ✅ `feature/responsive-design`
- ✅ `feature/backend-api`
- ✅ `feature/authentication`
- ✅ `feature/admin-panel`
- ✅ `feature/payment-integration`
- ✅ `feature/shipping-integration`
- ✅ `feature/guest-checkout`
- ✅ `feature/database-schema`
- ✅ `feature/cart-wishlist`
- ✅ `feature/search-filters`
- ✅ `feature/product-categories`

### Paso 3.3: Verificar ramas creadas

```powershell
git branch --list
```

---

## 🌐 Fase 4: Crear Repositorio en GitHub

### Paso 4.1: Ir a GitHub

1. Ir a https://github.com
2. Hacer clic en el botón **"+"** (arriba derecha)
3. Seleccionar **"New repository"**

### Paso 4.2: Configurar repositorio

```
Repository name: ecommerce-nextjs-fullstack
Description: E-commerce profesional con Next.js 15, Prisma, PostgreSQL, Transbank y Chilexpress
✅ Public
❌ NO marcar "Initialize this repository with a README"
```

### Paso 4.3: Crear repositorio

Hacer clic en **"Create repository"**

---

## 🔗 Fase 5: Conectar y Subir

### Paso 5.1: Agregar remote de GitHub

```powershell
# Reemplazar TU-USUARIO con tu usuario de GitHub
git remote add origin https://github.com/TU-USUARIO/ecommerce-nextjs-fullstack.git
```

Verificar:
```powershell
git remote -v
```

### Paso 5.2: Subir rama main

```powershell
git push -u origin main
```

### Paso 5.3: Subir todas las ramas de features

```powershell
git push --all origin
```

---

## ✅ Fase 6: Verificación Final

### Paso 6.1: Verificar en GitHub

1. Ir a tu repositorio en GitHub
2. Verificar que aparecen todas las ramas
3. Navegar por el código y verificar que NO hay datos sensibles

### Paso 6.2: Verificar .env NO está en GitHub

```
1. Ir a GitHub
2. Buscar ".env" en el repositorio
3. Debe aparecer SOLO ".env.example"
4. Si aparece ".env", ELIMINARLO INMEDIATAMENTE
```

### Paso 6.3: Revisar README.md

1. Ver el README.md en GitHub
2. Verificar que es la versión pública (sin datos del cliente)
3. Verificar que las instrucciones son genéricas

---

## 📝 Fase 7: Documentación del Repositorio

### Paso 7.1: Agregar descripción en GitHub

En la página del repositorio:
1. Clic en ⚙️ (Settings)
2. En "About", agregar:
   - **Description**: E-commerce profesional full-stack con Next.js
   - **Website**: (si tienes deploy)
   - **Topics**: nextjs, react, typescript, ecommerce, prisma, postgresql

### Paso 7.2: Crear archivo LICENSE (opcional)

```powershell
# En GitHub, crear archivo LICENSE
# Seleccionar MIT License
```

### Paso 7.3: Actualizar README con badges (opcional)

Agregar al inicio del README.md:
```markdown
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

---

## 🎯 Resultado Final

Tu repositorio en GitHub ahora tiene:

✅ **Rama main** - Código completo sanitizado
✅ **12 ramas de features** - Organizadas por funcionalidad
✅ **README público** - Sin información del cliente
✅ **.env.example** - Con valores de ejemplo
✅ **Documentación completa** - Guías y estructura
✅ **Sin datos sensibles** - Seguro para compartir

---

## 🔄 Mantenimiento Futuro

### Actualizar el repositorio

```powershell
# 1. Hacer cambios en el código
# 2. Sanitizar si es necesario
.\sanitize-for-github.ps1

# 3. Commit
git add .
git commit -m "feat: descripción del cambio"

# 4. Push
git push origin main
```

### Sincronizar ramas

```powershell
# Actualizar todas las ramas con cambios de main
foreach ($branch in (git branch --format="%(refname:short)")) {
    if ($branch -ne "main") {
        git checkout $branch
        git merge main
        git push origin $branch
    }
}
git checkout main
```

---

## 📞 Checklist Final

Antes de compartir tu repositorio:

- [ ] ✅ `.env` NO está en el repositorio
- [ ] ✅ No hay passwords reales en ningún archivo
- [ ] ✅ No hay AUTH_SECRET real
- [ ] ✅ No hay información personal del cliente
- [ ] ✅ README es genérico y profesional
- [ ] ✅ Todas las ramas están pusheadas
- [ ] ✅ Documentación está completa
- [ ] ✅ .gitignore está configurado correctamente
- [ ] ✅ Tienes copia de seguridad del .env original

---

## ⚠️ IMPORTANTE - Guardar .env Original

**Crear carpeta segura fuera del proyecto:**

```powershell
# Crear carpeta privada
New-Item -Path "C:\Proyectos-Privados\cliente-configs" -ItemType Directory -Force

# Copiar .env original
Copy-Item ".env" "C:\Proyectos-Privados\cliente-configs\proyecto-cliente.env"

Write-Host "✅ .env original guardado de forma segura"
```

---

## 🎉 ¡Felicitaciones!

Tu proyecto ahora está en GitHub público de forma segura, sin comprometer información del cliente.

### Compartir tu trabajo:

1. **En tu CV**: Agregar link a GitHub
2. **LinkedIn**: Compartir proyecto
3. **Portfolio**: Incluir como caso de estudio
4. **Reclutadores**: Mostrar organización y habilidades

**URL de tu repositorio:**
```
https://github.com/TU-USUARIO/ecommerce-nextjs-fullstack
```

---

## 📚 Recursos Adicionales

- [GUIA-SANITIZACION.md](GUIA-SANITIZACION.md) - Guía de seguridad
- [ESTRUCTURA-RAMAS.md](ESTRUCTURA-RAMAS.md) - Organización de ramas
- [README.PUBLIC.md](README.PUBLIC.md) - README público

---

**🔐 Recuerda: La seguridad del cliente es PRIMERO. Si tienes dudas, NO subas el archivo.**
