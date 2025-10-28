// Script para verificar imágenes faltantes
const fs = require('fs');
const path = require('path');

// Leer el archivo de productos
const productsPath = path.join(__dirname, 'src', 'data', 'products.ts');
const productsContent = fs.readFileSync(productsPath, 'utf8');

// Extraer todas las rutas de imágenes
const imageMatches = productsContent.match(/(?:image|images[^:]*:.*?)["']([^"']+)["']/g);
const imagePaths = [];

if (imageMatches) {
  imageMatches.forEach(match => {
    const pathMatch = match.match(/["']([^"']+)["']/);
    if (pathMatch) {
      imagePaths.push(pathMatch[1]);
    }
  });
}

console.log('Verificando imágenes...');
console.log(`Total de rutas encontradas: ${imagePaths.length}`);

const missingImages = [];
const publicPath = path.join(__dirname, 'public');

imagePaths.forEach(imagePath => {
  const fullPath = path.join(publicPath, imagePath);
  if (!fs.existsSync(fullPath)) {
    missingImages.push(imagePath);
  }
});

console.log('\n=== RESULTADOS ===');
if (missingImages.length === 0) {
  console.log('✅ Todas las imágenes existen');
} else {
  console.log(`❌ Imágenes faltantes (${missingImages.length}):`);
  missingImages.forEach(img => {
    console.log(`   - ${img}`);
  });
}

// También verificar caracteres problemáticos
const problematicPaths = imagePaths.filter(path => /[°@#$%^&*()+=\[\]{}|\\:";'<>?,`~]/.test(path));
if (problematicPaths.length > 0) {
  console.log('\n⚠️  Rutas con caracteres problemáticos:');
  problematicPaths.forEach(path => {
    console.log(`   - ${path}`);
  });
}