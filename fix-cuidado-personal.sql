-- =====================================================
-- SCRIPT PARA VERIFICAR Y CORREGIR CATEGORÍA "CUIDADO PERSONAL"
-- Ejecutar en Railway → PostgreSQL → Query
-- =====================================================

-- 1. Ver TODAS las categorías actuales
SELECT id, name, slug, 
       (SELECT COUNT(*) FROM products WHERE "categoryId" = categories.id) as product_count
FROM categories 
ORDER BY name;

-- 2. Buscar específicamente "Cuidado Personal" (cualquier variante)
SELECT id, name, slug 
FROM categories 
WHERE name ILIKE '%cuidado%' 
   OR slug ILIKE '%cuidado%';

-- 3. Si la categoría existe pero con slug incorrecto, CORREGIR:
-- (Descomenta la línea que corresponda según lo que veas arriba)

-- Si tiene slug "cuidado-personal" (con guión), cambiarlo:
-- UPDATE categories SET slug = 'cuidadopersonal' WHERE slug = 'cuidado-personal';

-- Si tiene slug "cuidado_personal" (con guión bajo), cambiarlo:
-- UPDATE categories SET slug = 'cuidadopersonal' WHERE slug = 'cuidado_personal';

-- Si tiene otro slug, cambiarlo por nombre:
-- UPDATE categories SET slug = 'cuidadopersonal' WHERE name ILIKE '%cuidado%personal%';

-- 4. Si NO existe, CREAR la categoría:
-- (Descomenta estas líneas si no existe)
/*
INSERT INTO categories (id, name, slug, description, image, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'Cuidado Personal',
  'cuidadopersonal',
  'Productos de cuidado personal y belleza',
  '/images/categorias/cuidado-personal.png',
  NOW(),
  NOW()
);
*/

-- 5. VERIFICAR que quedó bien:
SELECT id, name, slug 
FROM categories 
WHERE slug = 'cuidadopersonal';

-- 6. Ver productos de esa categoría (debería mostrar 5):
SELECT COUNT(*) as total_productos
FROM products p
JOIN categories c ON p."categoryId" = c.id
WHERE c.slug = 'cuidadopersonal';
