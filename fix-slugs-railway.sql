-- Script para corregir slugs de categorías en Railway
-- Ejecutar en Railway → PostgreSQL → Query

-- Ver slugs actuales
SELECT id, name, slug FROM categories ORDER BY name;

-- Corregir slugs para que coincidan con el frontend
UPDATE categories SET slug = 'actividad' WHERE name = 'Actividad';
UPDATE categories SET slug = 'cuidadopersonal' WHERE name ILIKE '%cuidado%personal%';
UPDATE categories SET slug = 'electrohogar' WHERE name = 'Electrohogar';
UPDATE categories SET slug = 'herramientas' WHERE name = 'Herramientas';
UPDATE categories SET slug = 'hogar' WHERE name = 'Hogar';
UPDATE categories SET slug = 'juguetes' WHERE name = 'Juguetes';
UPDATE categories SET slug = 'tecnologia' WHERE name ILIKE '%tecnolog%';

-- Verificar los cambios
SELECT id, name, slug FROM categories ORDER BY name;
