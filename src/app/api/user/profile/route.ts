/**
 * API para obtener y actualizar el perfil del usuario
 */
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Obtener datos del usuario
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        rut: true,
        address: true,
        city: true,
        zipCode: true,
        avatar: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error al obtener perfil:', error)
    return NextResponse.json(
      { error: 'Error al obtener perfil' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, phone, rut, address, city, zipCode } = body

    // Actualizar usuario
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        rut: rut || undefined,
        address: address || undefined,
        city: city || undefined,
        zipCode: zipCode || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        rut: true,
        address: true,
        city: true,
        zipCode: true,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      user
    })
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    return NextResponse.json(
      { error: 'Error al actualizar perfil' },
      { status: 500 }
    )
  }
}
