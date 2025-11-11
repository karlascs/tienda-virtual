// Script para generar hash de contraseña
const password = 'admin123'

// Simulación de bcrypt hash (10 rondas)
// En producción se usaría bcrypt.hash()
const hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

console.log('🔐 Hash de contraseña para admin:')
console.log(hash)
console.log('\n📝 Comando SQL:')
console.log(`
INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
SELECT 
  'admin-' || substr(md5(random()::text), 1, 25),
  'admin@izacas.com',
  'Administrador IZA&CAS',
  '${hash}',
  'ADMIN'::\"UserRole\",
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "User" WHERE email = 'admin@izacas.com'
);
`)
