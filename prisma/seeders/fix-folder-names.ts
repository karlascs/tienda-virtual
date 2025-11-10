/**
 * Script para corregir nombres de carpetas en las URLs de imágenes
 * Lee la estructura real de directorios y actualiza la BD
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Función para encontrar carpeta similar (ignorando mayúsculas y caracteres especiales)
function findSimilarFolder(folders: string[], searchName: string): string | null {
  const normalized = searchName.toLowerCase().replace(/[^a-z0-9]/g, '')
  
  // Primero buscar coincidencia exacta
  for (const folder of folders) {
    const folderNormalized = folder.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (folderNormalized === normalized) {
      return folder
    }
  }
  
  // Buscar mejor match por longitud de subcadena común al inicio
  let bestMatch: string | null = null
  let bestScore = 0
  
  for (const folder of folders) {
    const folderNormalized = folder.toLowerCase().replace(/[^a-z0-9]/g, '')
    
    // Contar caracteres comunes desde el inicio
    let commonPrefix = 0
    const minLength = Math.min(folderNormalized.length, normalized.length)
    
    for (let i = 0; i < minLength; i++) {
      if (folderNormalized[i] === normalized[i]) {
        commonPrefix++
      } else {
        break  // Parar en el primer caracter diferente
      }
    }
    
    // Score: prefijo común / longitud máxima
    const score = commonPrefix / Math.max(folderNormalized.length, normalized.length)
    
    if (score > bestScore && score >= 0.6) {  // 60% de match mínimo
      bestScore = score
      bestMatch = folder
    }
  }
  
  return bestMatch
}

async function main() {
  console.log('🔧 Corrigiendo nombres de carpetas en URLs...\n')

  const publicPath = path.join(process.cwd(), 'public')
  const products = await prisma.product.findMany()
  
  let updated = 0
  
  for (const product of products) {
    if (!product.images || product.images.length === 0) continue
    
    const newImages: string[] = []
    let hasChanges = false
    
    for (const imgPath of product.images) {
      // Parsear la URL: /images/categoria/subcategoria/producto/archivo.jpg
      const parts = imgPath.split('/')
      
      if (parts.length < 5) {
        newImages.push(imgPath)
        continue
      }
      
      const category = parts[2]  // tecnologia
      const subcategory = parts[3]  // camaras
      const productFolder = parts[4]  // minicamaraespiahd
      const filename = parts[5]  // archivo.jpg
      
      // Verificar si el directorio existe
      const categoryPath = path.join(publicPath, 'images', category)
      if (!fs.existsSync(categoryPath)) {
        newImages.push(imgPath)
        continue
      }
      
      const subcategoryPath = path.join(categoryPath, subcategory)
      if (!fs.existsSync(subcategoryPath)) {
        newImages.push(imgPath)
        continue
      }
      
      // Leer carpetas disponibles en la subcategoría
      const availableFolders = fs.readdirSync(subcategoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
      
      // Buscar carpeta similar
      const realFolder = findSimilarFolder(availableFolders, productFolder)
      
      if (realFolder && realFolder !== productFolder) {
        const newPath = `/images/${category}/${subcategory}/${realFolder}/${filename}`
        newImages.push(newPath)
        hasChanges = true
        console.log(`  ✏️  ${productFolder} → ${realFolder}`)
      } else {
        newImages.push(imgPath)
      }
    }
    
    if (hasChanges) {
      await prisma.product.update({
        where: { id: product.id },
        data: { images: newImages }
      })
      updated++
      console.log(`✅ ${product.name}`)
    }
  }
  
  console.log(`\n🎉 ${updated} productos actualizados`)
  
  await prisma.$disconnect()
}

main().catch(console.error)
