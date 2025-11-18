# Etapa 1: Construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración primero (para cache de Docker)
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./
COPY prisma ./prisma/
COPY scripts ./scripts/

# Instalar dependencias
RUN npm ci

# Generar Prisma Client antes del build
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copiar código fuente y archivos públicos
COPY src ./src
COPY public ./public
COPY *.config.* ./

# Build de Next.js
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine AS runner

WORKDIR /app

# Variables de entorno de producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar archivos necesarios desde builder con permisos correctos
# IMPORTANTE: Copiar public completo para que las imágenes funcionen
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD npx prisma migrate deploy && node server.js
