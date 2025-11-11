-- Script de inicialización para base de datos iza&cas
-- Se ejecuta automáticamente al crear el contenedor

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE '✅ Base de datos "iza&cas" inicializada correctamente';
  RAISE NOTICE '📊 Extensiones UUID y pg_trgm instaladas';
  RAISE NOTICE '🔧 Listo para ejecutar migraciones de Prisma';
END $$;
