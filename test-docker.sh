#!/bin/bash
# Script para probar Docker con panel de usuario
# IZA&CAS E-commerce

echo "========================================"
echo "  PROBANDO DOCKER CON PANEL DE USUARIO"
echo "========================================"
echo ""

# Paso 1: Detener contenedores existentes
echo "1. Deteniendo contenedores existentes..."
docker-compose -f docker-compose.3tier.yml down
echo "   ✓ Contenedores detenidos"
echo ""

# Paso 2: Rebuild de imágenes
echo "2. Reconstruyendo imágenes de Docker..."
docker-compose -f docker-compose.3tier.yml build --no-cache
if [ $? -eq 0 ]; then
    echo "   ✓ Imágenes reconstruidas exitosamente"
else
    echo "   ✗ Error al reconstruir imágenes"
    exit 1
fi
echo ""

# Paso 3: Iniciar servicios
echo "3. Iniciando servicios de Docker..."
docker-compose -f docker-compose.3tier.yml up -d
if [ $? -eq 0 ]; then
    echo "   ✓ Servicios iniciados"
else
    echo "   ✗ Error al iniciar servicios"
    exit 1
fi
echo ""

# Paso 4: Esperar a que la base de datos esté lista
echo "4. Esperando a que la base de datos esté lista..."
sleep 10
echo "   ✓ Base de datos lista"
echo ""

# Paso 5: Ver logs del frontend
echo "5. Mostrando logs del frontend (Ctrl+C para salir)..."
echo ""
docker-compose -f docker-compose.3tier.yml logs -f frontend

echo ""
echo "========================================"
echo "  INFORMACIÓN DE ACCESO"
echo "========================================"
echo ""
echo "🌐 Frontend:  http://localhost:3000"
echo "🔧 Backend:   http://localhost:3001"
echo "🗄️  PgAdmin:   http://localhost:5050"
echo ""
echo "👤 Usuario Admin:"
echo "   Email:    admin@izacas.com"
echo "   Password: Admin123!"
echo ""
echo "📋 Panel de Usuario: http://localhost:3000/profile"
echo "📦 Mis Órdenes:      http://localhost:3000/profile/orders"
echo ""
