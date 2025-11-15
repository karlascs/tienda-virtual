#!/bin/sh
set -e

echo "🔄 Aplicando migraciones de Prisma..."
npx prisma migrate deploy

echo "🚀 Iniciando servidor Next.js..."
# Railway asigna el puerto dinámicamente via $PORT
PORT=${PORT:-3000}
HOSTNAME=${HOSTNAME:-0.0.0.0}

echo "📡 Servidor escuchando en $HOSTNAME:$PORT"
node server.js
