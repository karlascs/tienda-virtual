-- Script para crear usuario administrador
-- Contraseña: admin123 (hash bcrypt)

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  'admin-' || gen_random_uuid()::text,
  'admin@izacas.com',
  'Administrador IZA&CAS',
  '$2a$10$YourHashedPasswordHere',  -- Necesita ser reemplazado con hash real
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  role = 'ADMIN',
  name = 'Administrador IZA&CAS',
  "updatedAt" = NOW();
