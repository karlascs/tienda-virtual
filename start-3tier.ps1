# Script de inicio para arquitectura de 3 capas
# Este script levanta la base de datos, ejecuta migraciones y luego inicia backend y frontend

Write-Host "`n🚀 IZA&CAS E-commerce - Arquitectura de 3 Capas" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
try {
    docker info | Out-Null
    Write-Host "✅ Docker está corriendo" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Docker no está corriendo. Inicia Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Componentes de la arquitectura:" -ForegroundColor Yellow
Write-Host "   1. PostgreSQL Database (puerto 5434)" -ForegroundColor White
Write-Host "   2. Backend API (puerto 3001)" -ForegroundColor White
Write-Host "   3. Frontend Web (puerto 3000)" -ForegroundColor White
Write-Host "   4. PgAdmin (puerto 5050)" -ForegroundColor White
Write-Host ""

# Limpiar contenedores anteriores
Write-Host "🧹 Limpiando contenedores anteriores..." -ForegroundColor Yellow
docker-compose -f docker-compose.3tier.yml down 2>$null
docker rm -f izacas-database izacas-backend izacas-frontend izacas-pgadmin 2>$null

Write-Host ""
Write-Host "🏗️  Construyendo imágenes..." -ForegroundColor Yellow
docker-compose -f docker-compose.3tier.yml build

Write-Host ""
Write-Host "📊 Paso 1: Iniciando Base de Datos..." -ForegroundColor Cyan
docker-compose -f docker-compose.3tier.yml up -d database pgadmin

Write-Host "⏳ Esperando a que PostgreSQL esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Ejecutar migraciones
Write-Host ""
Write-Host "🔧 Paso 2: Ejecutando migraciones de Prisma..." -ForegroundColor Cyan
$env:DATABASE_URL = 'postgresql://postgres:admin123@localhost:5434/iza&cas?schema=public'
npx prisma migrate deploy

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Advertencia: Las migraciones pueden haber fallado" -ForegroundColor Yellow
    Write-Host "   Continuando de todos modos..." -ForegroundColor Gray
}

# Generar Prisma Client
Write-Host "📦 Generando Prisma Client..." -ForegroundColor Cyan
npx prisma generate

Write-Host ""
Write-Host "🚀 Paso 3: Iniciando Backend y Frontend..." -ForegroundColor Cyan
docker-compose -f docker-compose.3tier.yml up -d backend frontend

Write-Host ""
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Verificar estado
Write-Host ""
Write-Host "📊 Estado de los contenedores:" -ForegroundColor Cyan
docker-compose -f docker-compose.3tier.yml ps

Write-Host ""
Write-Host "✅ ¡Arquitectura de 3 capas lista!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Accesos:" -ForegroundColor Cyan
Write-Host "   🎨 Frontend:   http://localhost:3000" -ForegroundColor White
Write-Host "   ⚙️  Backend:    http://localhost:3001" -ForegroundColor White
Write-Host "   📊 Database:   localhost:5434 (postgres/admin123)" -ForegroundColor White
Write-Host "   🔧 PgAdmin:    http://localhost:5050 (admin@izacas.com/admin123)" -ForegroundColor White
Write-Host ""
Write-Host "📝 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   Ver logs backend:   docker-compose -f docker-compose.3tier.yml logs -f backend" -ForegroundColor Gray
Write-Host "   Ver logs frontend:  docker-compose -f docker-compose.3tier.yml logs -f frontend" -ForegroundColor Gray
Write-Host "   Ver todos los logs: docker-compose -f docker-compose.3tier.yml logs -f" -ForegroundColor Gray
Write-Host "   Detener todo:       docker-compose -f docker-compose.3tier.yml down" -ForegroundColor Gray
Write-Host "   Reiniciar backend:  docker-compose -f docker-compose.3tier.yml restart backend" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 ¡Listo para desarrollar!" -ForegroundColor Green
Write-Host ""
