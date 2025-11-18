# Script para probar Docker con panel de usuario
# IZA&CAS E-commerce

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PROBANDO DOCKER CON PANEL DE USUARIO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Detener contenedores existentes
Write-Host "1. Deteniendo contenedores existentes..." -ForegroundColor Yellow
docker-compose -f docker-compose.3tier.yml down
Write-Host "   ✓ Contenedores detenidos" -ForegroundColor Green
Write-Host ""

# Paso 2: Rebuild de imágenes (para incluir nuevos archivos)
Write-Host "2. Reconstruyendo imágenes de Docker..." -ForegroundColor Yellow
docker-compose -f docker-compose.3tier.yml build --no-cache
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Imágenes reconstruidas exitosamente" -ForegroundColor Green
} else {
    Write-Host "   ✗ Error al reconstruir imágenes" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Paso 3: Iniciar servicios
Write-Host "3. Iniciando servicios de Docker..." -ForegroundColor Yellow
docker-compose -f docker-compose.3tier.yml up -d
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Servicios iniciados" -ForegroundColor Green
} else {
    Write-Host "   ✗ Error al iniciar servicios" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Paso 4: Esperar a que la base de datos esté lista
Write-Host "4. Esperando a que la base de datos esté lista..." -ForegroundColor Yellow
Start-Sleep -Seconds 10
Write-Host "   ✓ Base de datos lista" -ForegroundColor Green
Write-Host ""

# Paso 5: Ver logs del frontend
Write-Host "5. Mostrando logs del frontend (Ctrl+C para salir)..." -ForegroundColor Yellow
Write-Host ""
docker-compose -f docker-compose.3tier.yml logs -f frontend

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INFORMACIÓN DE ACCESO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Frontend:  http://localhost:3000" -ForegroundColor Green
Write-Host "🔧 Backend:   http://localhost:3001" -ForegroundColor Green
Write-Host "🗄️  PgAdmin:   http://localhost:5050" -ForegroundColor Green
Write-Host ""
Write-Host "👤 Usuario Admin:" -ForegroundColor Yellow
Write-Host "   Email:    admin@izacas.com" -ForegroundColor White
Write-Host "   Password: Admin123!" -ForegroundColor White
Write-Host ""
Write-Host "📋 Panel de Usuario: http://localhost:3000/profile" -ForegroundColor Cyan
Write-Host "📦 Mis Órdenes:      http://localhost:3000/profile/orders" -ForegroundColor Cyan
Write-Host ""
