import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { checkRateLimit, RateLimitPresets, createRateLimitResponse } from "@/lib/rate-limit";

// Esquema de validación
const registerSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .regex(/[A-Z]/, { message: "Debe contener al menos una mayúscula" })
    .regex(/[a-z]/, { message: "Debe contener al menos una minúscula" })
    .regex(/[0-9]/, { message: "Debe contener al menos un número" }),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 🔒 RATE LIMITING: 5 intentos por 15 minutos
    const rateLimitCheck = checkRateLimit(
      request,
      RateLimitPresets.AUTH.limit,
      RateLimitPresets.AUTH.windowMs
    );

    if (!rateLimitCheck.allowed) {
      const retryAfter = Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: "Demasiados intentos de registro. Por favor espera 15 minutos.",
        },
        {
          status: 429,
          headers: {
            ...createRateLimitResponse(0, rateLimitCheck.resetTime, retryAfter * 1000),
          },
        }
      );
    }
    const body = await request.json();

    // Validar datos de entrada
    const validatedFields = registerSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = validatedFields.data;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Este email ya está registrado",
        },
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        hashedPassword,
        phone: phone || null,
        role: "USER", // Por defecto es usuario normal
        emailVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    console.log("✅ Usuario registrado exitosamente:", user.email);

    return NextResponse.json(
      {
        success: true,
        message: "Usuario registrado exitosamente",
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error al registrar usuario:", error);
    console.error("Stack:", error?.stack);
    console.error("Message:", error?.message);
    
    // Si es error de Prisma/DB, dar más detalles
    if (error?.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          error: "Este email ya está registrado",
        },
        { status: 409 }
      );
    }
    
    // Error de conexión a BD
    if (error?.message?.includes('database') || error?.message?.includes('connect')) {
      console.error("🔴 DATABASE_URL:", process.env.DATABASE_URL ? "Configurada" : "❌ FALTA");
      return NextResponse.json(
        {
          success: false,
          error: "Error de conexión a la base de datos. Contacta al administrador.",
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
