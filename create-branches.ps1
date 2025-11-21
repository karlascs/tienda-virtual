# Script para crear todas las ramas del proyecto
# Ejecutar: .\create-branches.ps1

Write-Host "🌿 Creando estructura de ramas para el proyecto..." -ForegroundColor Cyan
Write-Host ""

# Definir las ramas a crear
$branches = @(
    @{Name="feature/frontend-components"; Description="Componentes React UI/UX"},
    @{Name="feature/responsive-design"; Description="Diseño mobile-first y breakpoints"},
    @{Name="feature/backend-api"; Description="API Routes y lógica de servidor"},
    @{Name="feature/authentication"; Description="NextAuth.js y sistema de roles"},
    @{Name="feature/admin-panel"; Description="Panel de administración completo"},
    @{Name="feature/payment-integration"; Description="Transbank Webpay Plus"},
    @{Name="feature/shipping-integration"; Description="Chilexpress API"},
    @{Name="feature/guest-checkout"; Description="Checkout sin registro"},
    @{Name="feature/database-schema"; Description="Prisma schema y migraciones"},
    @{Name="feature/cart-wishlist"; Description="Carrito y lista de deseos"},
    @{Name="feature/search-filters"; Description="Búsqueda y filtros"},
    @{Name="feature/product-categories"; Description="Sistema de categorías"}
)

# Verificar que estamos en un repositorio Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: No es un repositorio Git. Ejecuta 'git init' primero." -ForegroundColor Red
    exit 1
}

# Verificar que estamos en main
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -ne "main" -and $currentBranch -ne "master") {
    Write-Host "⚠️  No estás en la rama main. Cambiando..." -ForegroundColor Yellow
    git checkout main 2>$null
    if ($LASTEXITCODE -ne 0) {
        git checkout -b main
    }
}

Write-Host "✅ Rama actual: $(git rev-parse --abbrev-ref HEAD)" -ForegroundColor Green
Write-Host ""

# Crear cada rama
$created = 0
$skipped = 0

foreach ($branch in $branches) {
    $branchName = $branch.Name
    $description = $branch.Description
    
    # Verificar si la rama ya existe
    $exists = git rev-parse --verify $branchName 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "⏭️  Rama ya existe: $branchName" -ForegroundColor Yellow
        $skipped++
    } else {
        # Crear la rama
        git checkout -b $branchName main 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Rama creada: $branchName - $description" -ForegroundColor Green
            $created++
            
            # Volver a main
            git checkout main 2>$null
        } else {
            Write-Host "❌ Error creando: $branchName" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "=" -repeat 60 -ForegroundColor Cyan
Write-Host "📊 RESUMEN" -ForegroundColor Cyan
Write-Host "=" -repeat 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Ramas creadas: $created" -ForegroundColor Green
Write-Host "⏭️  Ramas existentes: $skipped" -ForegroundColor Yellow
Write-Host "📝 Total de ramas: $($branches.Count)" -ForegroundColor Cyan
Write-Host ""

# Listar todas las ramas
Write-Host "🌳 Ramas disponibles:" -ForegroundColor Cyan
git branch --list

Write-Host ""
Write-Host "📝 SIGUIENTES PASOS:" -ForegroundColor Cyan
Write-Host "1. Para trabajar en una rama específica:" -ForegroundColor White
Write-Host "   git checkout nombre-de-la-rama" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Para subir una rama a GitHub:" -ForegroundColor White
Write-Host "   git push -u origin nombre-de-la-rama" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Para subir TODAS las ramas:" -ForegroundColor White
Write-Host "   git push --all origin" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Ver estructura completa en:" -ForegroundColor White
Write-Host "   ESTRUCTURA-RAMAS.md" -ForegroundColor Gray
Write-Host ""
