-- Actualizar rutas de imágenes de categorías
UPDATE categories SET image = '/images/categorias/juguetes.png' WHERE slug = 'juguetes';
UPDATE categories SET image = '/images/categorias/tecnologia.png' WHERE slug = 'tecnologia';
UPDATE categories SET image = '/images/categorias/hogar.png' WHERE slug = 'hogar';
UPDATE categories SET image = '/images/categorias/electrohogar.png' WHERE slug = 'electrohogar';
UPDATE categories SET image = '/images/categorias/cuidadopersonal.png' WHERE slug = 'cuidado-personal';
UPDATE categories SET image = '/images/categorias/herramientas.png' WHERE slug = 'herramientas';
UPDATE categories SET image = '/images/categorias/actividad.png' WHERE slug = 'actividad';

-- Verificar
SELECT name, slug, image FROM categories;
