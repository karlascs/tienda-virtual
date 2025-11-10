#!/bin/bash
# Script de inicio rápido para Docker

echo "🐳 Iniciando IZA&CAS E-commerce con Docker..."
echo ""

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo. Por favor inicia Docker Desktop."
    exit 1
fi

echo "✅ Docker está corriendo"
echo ""

# Construir y levantar contenedores
echo "📦 Construyendo e iniciando contenedores..."
docker-compose up -d --build

echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado
echo ""
echo "📊 Estado de los contenedores:"
docker-compose ps

echo ""
echo "🌱 Sembrando datos iniciales..."
docker-compose exec -T app npx tsx prisma/seeders/seed-real-products.ts
docker-compose exec -T app npx tsx prisma/seeders/seed-banners.ts

echo ""
echo "✅ ¡Todo listo!"
echo ""
echo "🌐 Accesos:"
echo "   - Aplicación:  http://localhost:3000"
echo "   - Admin:       http://localhost:3000/admin"
echo "   - PgAdmin:     http://localhost:5050"
echo ""
echo "📝 Comandos útiles:"
echo "   - Ver logs:        docker-compose logs -f app"
echo "   - Detener:         docker-compose down"
echo "   - Reiniciar:       docker-compose restart app"
echo ""
