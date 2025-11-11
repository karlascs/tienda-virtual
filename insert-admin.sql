INSERT INTO "users" (id, email, name, "hashedPassword", role, "createdAt", "updatedAt")
SELECT 
  'admin-' || substr(md5(random()::text), 1, 25),
  'admin@izacas.com',
  'Administrador IZA&CAS',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'ADMIN'::"UserRole",
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "users" WHERE email = 'admin@izacas.com'
);

SELECT 
  email,
  name,
  role,
  "createdAt"
FROM "users"
WHERE email = 'admin@izacas.com';
