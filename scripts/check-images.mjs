/**
 * Script para verificar todas las imágenes del proyecto
 * Identifica imágenes rotas y sugiere soluciones
 */

import fs from 'fs';
import path from 'path';
import { FEATURED_PRODUCTS } from '../src/data/products.js';

const publicDir = path.join(process.cwd(), 'public');

/**
 * Verifica si un archivo existe
 */
function checkImageExists(imagePath) {
  const fullPath = path.join(publicDir, imagePath.replace(/^\//, ''));
  return fs.existsSync(fullPath);
}

/**
 * Lista todas las imágenes en el archivo de productos
 */
function getAllImagePaths() {
  const imagePaths = new Set();
  
  FEATURED_PRODUCTS.forEach(product => {
    // Imagen principal
    if (product.image) {
      imagePaths.add(product.image);
    }
    
    // Imágenes adicionales
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => imagePaths.add(img));
    }
  });
  
  return Array.from(imagePaths);
}

/**
 * Verifica todas las imágenes
 */
function checkAllImages() {
  const allImages = getAllImagePaths();
  const results = {
    total: allImages.length,
    existing: [],
    missing: [],
    problematic: []
  };
  
  console.log(`🔍 Verificando ${allImages.length} imágenes...`);
  
  allImages.forEach(imagePath => {
    const exists = checkImageExists(imagePath);
    
    if (exists) {
      results.existing.push(imagePath);
    } else {
      results.missing.push(imagePath);
      
      // Verificar si tiene caracteres problemáticos
      if (/[+=\s#&?]/.test(imagePath)) {
        results.problematic.push(imagePath);
      }
    }
  });
  
  return results;
}

/**
 * Reporte de resultados
 */
function generateReport() {
  const results = checkAllImages();
  
  console.log('\n📊 REPORTE DE IMÁGENES\n');
  console.log(`✅ Imágenes encontradas: ${results.existing.length}`);
  console.log(`❌ Imágenes faltantes: ${results.missing.length}`);
  console.log(`⚠️  Imágenes con caracteres problemáticos: ${results.problematic.length}`);
  
  if (results.missing.length > 0) {
    console.log('\n❌ IMÁGENES FALTANTES:');
    results.missing.forEach(img => {
      console.log(`   ${img}`);
    });
  }
  
  if (results.problematic.length > 0) {
    console.log('\n⚠️  IMÁGENES CON CARACTERES PROBLEMÁTICOS:');
    results.problematic.forEach(img => {
      console.log(`   ${img}`);
      console.log(`   → Codificada: ${encodeURIComponent(img)}`);
    });
  }
  
  // Sugerencias
  console.log('\n💡 SUGERENCIAS:');
  if (results.problematic.length > 0) {
    console.log('   1. Las imágenes con caracteres especiales (+, =, espacios) pueden fallar en Vercel');
    console.log('   2. Se han implementado utilidades de encoding automático');
    console.log('   3. Verificar que las rutas sean exactas (case-sensitive)');
  }
  
  if (results.missing.length > 0) {
    console.log('   4. Verificar que los archivos existan en la carpeta public/');
    console.log('   5. Revisar nombres de carpetas y archivos');
  }
}

// Ejecutar el script
generateReport();