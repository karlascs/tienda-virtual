/**
 * Verificador de imágenes - Lista problemas comunes
 */

import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');

// Lista de imágenes problemáticas conocidas (con caracteres especiales)
const problematicImages = [
  "/images/hogar/cocina/cafeteraitaliana9tazas/Url9AggQ2RUXSM6L+mNN6A==.jpg",
  "/images/hogar/cocina/hornillareververo1f/PTwIVR2n6z+wyEBWAfifA==.jpg",
  "/images/hogar/electrodomesticos/moledordecafe/gF3ZFgRvL+YStUknLgsPg==.jpg",
  "/images/hogar/ropa de cama/cobertorcon diseño2plazas/eOTcYbvYGAQe3udS+ja5w==.jpg",
  "/images/hogar/ropa de cama/cobertorconchiporrodiseño2plazas/JfKu7Z2pqcy1ESm+8oN34A==.jpg",
  "/images/hogar/alfomfrapeluda150/jL0a1PHT+Z3y4HvRgayXNg==.jpg"
];

console.log('🔍 Verificando imágenes problemáticas...\n');

problematicImages.forEach((imagePath, index) => {
  const fullPath = path.join(publicDir, imagePath.replace(/^\//, ''));
  const exists = fs.existsSync(fullPath);
  
  console.log(`${index + 1}. ${imagePath}`);
  console.log(`   📁 Existe: ${exists ? '✅ SÍ' : '❌ NO'}`);
  console.log(`   🔗 Codificada: ${encodeURIComponent(imagePath)}`);
  
  // Verificar caracteres problemáticos
  const hasProblems = /[+=\s]/.test(imagePath);
  if (hasProblems) {
    console.log(`   ⚠️  Caracteres problemáticos detectados`);
  }
  
  console.log('');
});

// Verificar estructura de carpetas
console.log('📂 Verificando estructura de carpetas...\n');

const categoriasPath = path.join(publicDir, 'images');
if (fs.existsSync(categoriasPath)) {
  const categorias = fs.readdirSync(categoriasPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  console.log('Categorías encontradas:');
  categorias.forEach(cat => {
    console.log(`   📁 ${cat}`);
  });
} else {
  console.log('❌ Carpeta /images no encontrada');
}

console.log('\n💡 RECOMENDACIONES:');
console.log('1. Verificar que todas las imágenes existan en public/images/');
console.log('2. Los caracteres +, =, espacios pueden causar problemas en Vercel');
console.log('3. Se ha implementado encoding automático en los componentes');
console.log('4. Verificar case-sensitivity en nombres de archivos');