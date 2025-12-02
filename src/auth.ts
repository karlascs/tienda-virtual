/**
 * ========================================
 * CONFIGURACIÓN DE NEXTAUTH PARA IZA&CAS
 * ========================================
 * 
 * Sistema de autenticación completo usando NextAuth v5 (Auth.js)
 * Implementa autenticación basada en credenciales con JWT.
 * 
 * Características:
 * - Autenticación por email/contraseña con bcrypt
 * - Sesiones JWT (sin base de datos de sesiones)
 * - Roles de usuario (USER, ADMIN)
 * - Validación con Zod
 * - Extensión de tipos de NextAuth para incluir role y emailVerified
 * - Duración de sesión: 30 días
 * - Páginas personalizadas de login y error
 * 
 * Flujo de autenticación:
 * 1. Usuario envía credenciales (email/password)
 * 2. Se valida formato con Zod
 * 3. Se busca usuario en base de datos
 * 4. Se verifica contraseña con bcrypt
 * 5. Se genera JWT con información del usuario
 * 6. JWT se almacena en cookie httpOnly
 * 
 * @module auth
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

/**
 * Tipo de rol de usuario
 * Debe coincidir exactamente con el enum UserRole en Prisma schema
 */
export type UserRole = 'USER' | 'ADMIN';

/**
 * Schema de validación para credenciales de login
 * Valida formato de email y longitud mínima de contraseña
 */
const credentialsSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Contraseña debe tener al menos 6 caracteres" }),
});

/**
 * Extensión de tipos de NextAuth
 * Agrega campos personalizados a los tipos predeterminados de NextAuth
 */
declare module "next-auth" {
  /**
   * Interfaz User extendida
   * Agrega role y emailVerified al objeto User
   */
  interface User {
    role: UserRole;
    emailVerified?: boolean | Date | null;
  }
  
  /**
   * Interfaz Session extendida
   * Define la estructura completa del objeto de sesión
   * Disponible en componentes mediante useSession() o auth()
   */
  interface Session {
    user: {
      id: string;              // ID único del usuario
      name: string;            // Nombre completo
      email: string;           // Email (único)
      role: UserRole;          // Rol (USER o ADMIN)
      emailVerified?: boolean | Date | null;  // Estado de verificación
      image?: string;          // Avatar/foto (opcional)
    };
  }
}

/**
 * Extensión del tipo JWT
 * Agrega campos personalizados al token JWT
 */
declare module "@auth/core/jwt" {
  interface JWT {
    role: UserRole;                            // Rol del usuario en el token
    emailVerified?: boolean | Date | null;     // Estado de verificación en el token
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      /**
       * Función de autorización
       * Valida credenciales y retorna datos del usuario o null si falla
       * 
       * @param credentials - Email y contraseña del usuario
       * @returns User object si las credenciales son válidas, null si no
       */
      async authorize(credentials) {
        try {
          // 1. Validar estructura de credenciales con Zod
          const validatedFields = credentialsSchema.safeParse(credentials);
          
          if (!validatedFields.success) {
            console.error("❌ Validación fallida:", validatedFields.error.flatten().fieldErrors);
            return null;  // Formato inválido
          }

          const { email, password } = validatedFields.data;

          // 2. Buscar usuario en la base de datos PostgreSQL
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: {
              id: true,
              name: true,
              email: true,
              hashedPassword: true,
              role: true,
              emailVerified: true,
              avatar: true,
            },
          });

          if (!user || !user.hashedPassword) {
            console.error("❌ Usuario no encontrado o sin contraseña");
            return null;
          }

          // Verificar contraseña
          const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

          if (!isPasswordValid) {
            console.error("❌ Contraseña incorrecta");
            return null;
          }

          console.log("✅ Login exitoso:", user.email);

          // Retornar usuario sin el hash de la contraseña
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified || false,
            image: user.avatar,
          };
        } catch (error) {
          console.error("❌ Error en authorize:", error);
          return null;
        }
      },
    }),
  ],
  /**
   * Callbacks de NextAuth
   * Personalizan el comportamiento de JWT y sesiones
   */
  callbacks: {
    /**
     * Callback JWT
     * Se ejecuta cuando se crea o actualiza un token JWT
     * 
     * @param token - Token JWT actual
     * @param user - Usuario (solo disponible en primer login)
     * @param trigger - Evento que disparó el callback ('signIn', 'signUp', 'update')
     * @param session - Nueva sesión (solo en updates)
     */
    async jwt({ token, user, trigger, session }) {
      // En el primer login, agregar datos del usuario al token
      if (user) {
        token.role = user.role;                    // Rol del usuario
        token.emailVerified = user.emailVerified;  // Estado de verificación
        token.sub = user.id;                       // Subject (ID del usuario)
      }

      // Si se actualiza la sesión manualmente, actualizar el token
      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
      }

      return token;
    },
    
    /**
     * Callback Session
     * Se ejecuta cuando se accede a la sesión del usuario
     * Transforma el token JWT en objeto de sesión
     * 
     * @param session - Objeto de sesión base
     * @param token - Token JWT decodificado
     */
    async session({ session, token }) {
      // Transferir datos del token a la sesión
      if (token && session.user) {
        session.user.id = token.sub as string;      // ID del usuario
        session.user.role = token.role as UserRole; // Rol del usuario
        
        // Convertir emailVerified a Date o null para compatibilidad
        session.user.emailVerified = token.emailVerified === true 
          ? new Date() 
          : token.emailVerified instanceof Date 
            ? token.emailVerified 
            : null;
      }
      return session;
    },
  },
  /**
   * Configuración de seguridad
   */
  secret: process.env.AUTH_SECRET,  // Clave secreta para firmar JWT (OBLIGATORIA)
  trustHost: true,                  // Confiar en el host (necesario para Railway/Vercel)
  debug: process.env.NODE_ENV === "development",  // Logs detallados solo en desarrollo
});

/**
 * Exports principales
 * - handlers: Manejadores HTTP para rutas de API
 * - auth: Función para obtener sesión en Server Components
 * - signIn: Función para iniciar sesión
 * - signOut: Función para cerrar sesión
 */
