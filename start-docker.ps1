# Script de inicio rápido para Docker (Windows PowerShell)

Write-Host "🐳 Iniciando IZA&CAS E-commerce con Docker..." -ForegroundColor Cyan
Write-Host ""

# Verificar si Docker está corriendo
try {
    docker info | Out-Null
    Write-Host "✅ Docker está corriendo" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Docker no está corriendo. Por favor inicia Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Construir y levantar contenedores
Write-Host "📦 Construyendo e iniciando contenedores..." -ForegroundColor Yellow
docker-compose up -d --build

Write-Host ""
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Verificar estado
Write-Host ""
Write-Host "📊 Estado de los contenedores:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "🌱 Sembrando datos iniciales..." -ForegroundColor Yellow
docker-compose exec -T app npx tsx prisma/seeders/seed-real-products.ts
docker-compose exec -T app npx tsx prisma/seeders/seed-banners.ts

Write-Host ""
Write-Host "✅ ¡Todo listo!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Accesos:" -ForegroundColor Cyan
Write-Host "   - Aplicación:  http://localhost:3000"
Write-Host "   - Admin:       http://localhost:3000/admin"
Write-Host "   - PgAdmin:     http://localhost:5050"
Write-Host ""
Write-Host "📝 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   - Ver logs:        docker-compose logs -f app"
Write-Host "   - Detener:         docker-compose down"
Write-Host "   - Reiniciar:       docker-compose restart app"
Write-Host ""
