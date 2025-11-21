# Script para sanitizar archivos antes de subir a GitHub público
# Ejecutar: .\sanitize-for-github.ps1

Write-Host "🔒 Iniciando sanitización del proyecto para GitHub público..." -ForegroundColor Cyan
Write-Host ""

# 1. Verificar que .env no se vaya a subir
Write-Host "📋 Verificando .gitignore..." -ForegroundColor Yellow
if (Select-String -Path .gitignore -Pattern "^\.env$" -Quiet) {
    Write-Host "✅ .env está en .gitignore" -ForegroundColor Green
} else {
    Write-Host "❌ ADVERTENCIA: .env NO está en .gitignore" -ForegroundColor Red
    exit 1
}

# 2. Crear respaldo del README original
Write-Host ""
Write-Host "📄 Creando respaldo del README original..." -ForegroundColor Yellow
if (Test-Path "README.md") {
    Copy-Item "README.md" "README.CLIENTE-BACKUP.md" -Force
    Write-Host "✅ Respaldo creado: README.CLIENTE-BACKUP.md" -ForegroundColor Green
}

# 3. Reemplazar README con versión pública
if (Test-Path "README.PUBLIC.md") {
    Copy-Item "README.PUBLIC.md" "README.md" -Force
    Write-Host "✅ README.md reemplazado con versión pública" -ForegroundColor Green
}

# 4. Buscar posibles datos sensibles
Write-Host ""
Write-Host "🔍 Buscando posibles datos sensibles..." -ForegroundColor Yellow
Write-Host ""

$sensiblePatterns = @{
    "IZA&CAS" = "Nombre del cliente"
    "Simón Bolívar" = "Dirección del cliente"
    "izacas2024" = "Password de base de datos"
    "admin123" = "Password de admin"
    "85c9MFNVPG6fUsU6c0EeNa0LTJtKvMlcy77Js+10jIc" = "AUTH_SECRET del cliente"
    "ClLVfo1Ia7rOFAZQ\+iCqlsy25PJdRJi\+ArCbBc3TLBs=" = "Otro AUTH_SECRET"
}

$foundIssues = $false
foreach ($pattern in $sensiblePatterns.Keys) {
    $description = $sensiblePatterns[$pattern]
    $results = Select-String -Path "*.md", "*.yml", "*.ts", "*.tsx", "*.js" -Pattern $pattern -Exclude "GUIA-SANITIZACION.md", "sanitize-for-github.ps1", "README.CLIENTE-BACKUP.md", ".env" -ErrorAction SilentlyContinue
    
    if ($results) {
        $foundIssues = $true
        Write-Host "⚠️  Encontrado: $description" -ForegroundColor Red
        foreach ($result in $results) {
            Write-Host "   📁 $($result.Filename):$($result.LineNumber)" -ForegroundColor Yellow
        }
    }
}

if (-not $foundIssues) {
    Write-Host "✅ No se encontraron datos sensibles obvios" -ForegroundColor Green
}

# 5. Verificar que .env.example existe
Write-Host ""
Write-Host "📋 Verificando .env.example..." -ForegroundColor Yellow
if (Test-Path ".env.example") {
    Write-Host "✅ .env.example existe" -ForegroundColor Green
} else {
    Write-Host "❌ ADVERTENCIA: .env.example no existe" -ForegroundColor Red
}

# 6. Mostrar archivos que se subirán
Write-Host ""
Write-Host "📦 Archivos que se subirán a GitHub:" -ForegroundColor Yellow
git status --short 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Git no está inicializado. Ejecuta 'git init' primero." -ForegroundColor Yellow
}

# 7. Resumen
Write-Host ""
Write-Host "=" -repeat 60 -ForegroundColor Cyan
Write-Host "📊 RESUMEN DE SANITIZACIÓN" -ForegroundColor Cyan
Write-Host "=" -repeat 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Archivos respaldados" -ForegroundColor Green
Write-Host "✅ README reemplazado con versión pública" -ForegroundColor Green
Write-Host "✅ .gitignore verificado" -ForegroundColor Green

if ($foundIssues) {
    Write-Host "⚠️  Se encontraron posibles datos sensibles - revisar arriba" -ForegroundColor Yellow
} else {
    Write-Host "✅ No se encontraron datos sensibles obvios" -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 SIGUIENTES PASOS:" -ForegroundColor Cyan
Write-Host "1. Revisar manualmente los archivos marcados arriba" -ForegroundColor White
Write-Host "2. Sanitizar los archivos que contengan datos sensibles" -ForegroundColor White
Write-Host "3. Ejecutar: git add ." -ForegroundColor White
Write-Host "4. Ejecutar: git commit -m 'chore: initial commit - sanitized version'" -ForegroundColor White
Write-Host "5. Crear repositorio en GitHub" -ForegroundColor White
Write-Host "6. Ejecutar: git remote add origin URL_DEL_REPO" -ForegroundColor White
Write-Host "7. Ejecutar: git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Mantén una copia del archivo .env original en un lugar seguro" -ForegroundColor Yellow
Write-Host ""
