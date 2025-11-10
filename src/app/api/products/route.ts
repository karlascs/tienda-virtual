/**
 * API Routes para Productos - IZA&CAS E-commerce
 * GET /api/products - Listar productos con filtros
 * POST /api/products - Crear nuevo producto (admin)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parámetros de filtrado
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const featured = searchParams.get('featured') === 'true'

    // Construir filtros dinámicos
    const where: any = {
      isActive: true,
    }

    if (category) {
      where.category = {
        slug: category,
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (featured) {
      where.isFeatured = true
    }

    // Configurar ordenamiento
    const orderBy: any = {}
    if (sortBy === 'price') {
      orderBy.price = sortOrder
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder
    } else if (sortBy === 'rating') {
      orderBy.averageRating = sortOrder
    } else {
      orderBy.createdAt = sortOrder
    }

    // Calcular offset para paginación
    const skip = (page - 1) * limit

    // Ejecutar queries en paralelo
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    // Calcular metadata de paginación
    const totalPages = Math.ceil(totalCount / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext,
        hasPrev,
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}

// POST /api/products (Crear producto - admin only)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validación básica
    const { name, description, price, categoryId, brand, features, images, stock } = data
    
    if (!name || !price || !categoryId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campos requeridos: name, price, categoryId',
        },
        { status: 400 }
      )
    }

    // Verificar que la categoría existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Categoría no encontrada',
        },
        { status: 404 }
      )
    }

    // Generar slug único
    const baseSlug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    let slug = baseSlug
    let counter = 1
    
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Generar SKU único
    const categoryCode = category.slug.substring(0, 5).toUpperCase()
    const productCount = await prisma.product.count({
      where: { categoryId }
    })
    const sku = `SKU-${categoryCode}-${(productCount + 1).toString().padStart(3, '0')}`

    // Crear producto
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        description,
        price: parseFloat(price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        discount: data.discount || 0,
        brand,
        model: data.model,
        features: features || [],
        images: images || [],
        stock: stock || 0,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        categoryId,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}