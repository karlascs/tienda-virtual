# Script para crear ramas del proyecto tienda-virtual
# Ejecutar: .\create-project-branches.ps1

Write-Host "`n" -NoNewline
Write-Host "=" -repeat 70 -ForegroundColor Cyan
Write-Host "   CREANDO RAMAS PARA TIENDA VIRTUAL" -ForegroundColor Cyan
Write-Host "   Repositorio: https://github.com/karlascs/tienda-virtual.git" -ForegroundColor White
Write-Host "=" -repeat 70 -ForegroundColor Cyan
Write-Host ""

# Definir las ramas a crear
$branches = @(
    @{Name="frontend"; Description="Componentes React, páginas Next.js y estilos"},
    @{Name="backend"; Description="APIs, autenticación y lógica de negocio"},
    @{Name="prisma-database"; Description="Schema, migraciones y seeders"},
    @{Name="docker"; Description="Configuración Docker y despliegue"}
)

# Verificar que estamos en un repositorio Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: No es un repositorio Git." -ForegroundColor Red
    Write-Host "   Ejecuta: git init" -ForegroundColor Yellow
    exit 1
}

# Obtener rama actual
$currentBranch = git rev-parse --abbrev-ref HEAD 2>$null
Write-Host "📍 Rama actual: $currentBranch" -ForegroundColor Cyan
Write-Host ""

# Si no estamos en master, cambiar a master
if ($currentBranch -ne "master" -and $currentBranch -ne "main") {
    Write-Host "⚠️  Cambiando a rama master..." -ForegroundColor Yellow
    git checkout master 2>$null
    if ($LASTEXITCODE -ne 0) {
        git checkout main 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ No se encontró rama master ni main" -ForegroundColor Red
            exit 1
        }
        $baseBranch = "main"
    } else {
        $baseBranch = "master"
    }
} else {
    $baseBranch = $currentBranch
}

Write-Host "✅ Rama base: $baseBranch" -ForegroundColor Green
Write-Host ""
Write-Host "🌿 Creando ramas del proyecto..." -ForegroundColor Cyan
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
        Write-Host "⏭️  Rama existente: $branchName" -ForegroundColor Yellow
        Write-Host "   $description" -ForegroundColor Gray
        $skipped++
    } else {
        # Crear la rama desde master/main
        git checkout -b $branchName $baseBranch 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Rama creada: $branchName" -ForegroundColor Green
            Write-Host "   $description" -ForegroundColor Gray
            $created++
            
            # Volver a master/main
            git checkout $baseBranch 2>$null
        } else {
            Write-Host "❌ Error creando: $branchName" -ForegroundColor Red
        }
    }
    Write-Host ""
}

Write-Host "=" -repeat 70 -ForegroundColor Cyan
Write-Host "📊 RESUMEN" -ForegroundColor Cyan
Write-Host "=" -repeat 70 -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Ramas creadas: $created" -ForegroundColor Green
Write-Host "⏭️  Ramas existentes: $skipped" -ForegroundColor Yellow
Write-Host "📝 Total de ramas del proyecto: $($branches.Count)" -ForegroundColor Cyan
Write-Host ""

# Listar todas las ramas
Write-Host "🌳 Ramas disponibles:" -ForegroundColor Cyan
git branch --list
Write-Host ""

# Mostrar información del repositorio remoto si existe
$remoteUrl = git config --get remote.origin.url 2>$null
if ($remoteUrl) {
    Write-Host "🌐 Repositorio remoto:" -ForegroundColor Cyan
    Write-Host "   $remoteUrl" -ForegroundColor White
    Write-Host ""
}

Write-Host "=" -repeat 70 -ForegroundColor Cyan
Write-Host "📝 SIGUIENTES PASOS" -ForegroundColor Cyan
Write-Host "=" -repeat 70 -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Trabajar en una rama específica:" -ForegroundColor Yellow
Write-Host "   git checkout frontend" -ForegroundColor Gray
Write-Host "   git checkout backend" -ForegroundColor Gray
Write-Host "   git checkout prisma-database" -ForegroundColor Gray
Write-Host "   git checkout docker" -ForegroundColor Gray
Write-Host ""

Write-Host "2️⃣  Subir una rama al repositorio remoto:" -ForegroundColor Yellow
Write-Host "   git push -u origin nombre-rama" -ForegroundColor Gray
Write-Host ""

Write-Host "3️⃣  Subir TODAS las ramas:" -ForegroundColor Yellow
Write-Host "   git push --all origin" -ForegroundColor Gray
Write-Host ""

Write-Host "4️⃣  Ver la estructura completa:" -ForegroundColor Yellow
Write-Host "   notepad ESTRUCTURA-RAMAS-PROYECTO.md" -ForegroundColor Gray
Write-Host ""

Write-Host "5️⃣  Verificar en GitHub:" -ForegroundColor Yellow
Write-Host "   https://github.com/karlascs/tienda-virtual" -ForegroundColor Gray
Write-Host ""

Write-Host "=" -repeat 70 -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Ramas creadas exitosamente para el proyecto!" -ForegroundColor Green
Write-Host ""
