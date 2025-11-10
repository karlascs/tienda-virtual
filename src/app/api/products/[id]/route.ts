/**
 * API Routes para Producto Individual - IZA&CAS E-commerce
 * GET /api/products/[id] - Obtener producto por ID
 * PUT /api/products/[id] - Actualizar producto (admin)
 * DELETE /api/products/[id] - Eliminar producto (admin)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/products/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    // Intentar buscar por ID primero, luego por slug
    let product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // Últimas 10 reseñas
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    })

    // Si no se encuentra por ID, intentar por slug
    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          reviews: {
            include: {
              user: {
                select: {
                  name: true,
                  avatar: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 10,
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      })
    }

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Producto no encontrado',
        },
        { status: 404 }
      )
    }

    // Registrar vista del producto para analytics
    await prisma.productView.create({
      data: {
        productId: product.id,
        // userId: se podría obtener del token de sesión
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    }).catch(() => {
      // Ignorar errores de analytics, no deben afectar la respuesta
    })

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] (Actualizar producto - admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const data = await request.json()

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: 'Producto no encontrado',
        },
        { status: 404 }
      )
    }

    // Si se cambia el nombre, generar nuevo slug
    let updateData: any = { ...data }
    
    if (data.name && data.name !== existingProduct.name) {
      const baseSlug = data.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()

      let slug = baseSlug
      let counter = 1
      
      while (await prisma.product.findFirst({ 
        where: { 
          slug,
          NOT: { id: existingProduct.id }
        } 
      })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
      
      updateData.slug = slug
    }

    // Convertir precios a números si están presentes
    if (updateData.price) updateData.price = parseFloat(updateData.price)
    if (updateData.originalPrice) updateData.originalPrice = parseFloat(updateData.originalPrice)

    // Actualizar producto
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] (Eliminar producto - admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: 'Producto no encontrado',
        },
        { status: 404 }
      )
    }

    // Soft delete - solo marcar como inactivo
    const product = await prisma.product.update({
      where: { id },
      data: {
        isActive: false,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Producto eliminado exitosamente',
      data: product,
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}