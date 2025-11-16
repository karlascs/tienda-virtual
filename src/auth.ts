import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Definir tipo UserRole localmente (mismo que en Prisma schema)
export type UserRole = 'USER' | 'ADMIN';

// Validación de credenciales
const credentialsSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Contraseña debe tener al menos 6 caracteres" }),
});

// Extender tipos de NextAuth
declare module "next-auth" {
  interface User {
    role: UserRole;
    emailVerified?: boolean | Date | null;
  }
  
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      emailVerified?: boolean | Date | null;
      image?: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: UserRole;
    emailVerified?: boolean | Date | null;
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
      async authorize(credentials) {
        try {
          // Validar estructura de credenciales
          const validatedFields = credentialsSchema.safeParse(credentials);
          
          if (!validatedFields.success) {
            console.error("❌ Validación fallida:", validatedFields.error.flatten().fieldErrors);
            return null;
          }

          const { email, password } = validatedFields.data;

          // Buscar usuario en la base de datos
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
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Agregar role y emailVerified al token en el primer login
      if (user) {
        token.role = user.role;
        token.emailVerified = user.emailVerified;
        token.sub = user.id;
      }

      // Actualizar token si hay cambios en la sesión
      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
      }

      return token;
    },
    async session({ session, token }) {
      // Agregar información del usuario a la sesión
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as UserRole;
        // Convertir emailVerified a Date o null
        session.user.emailVerified = token.emailVerified === true 
          ? new Date() 
          : token.emailVerified instanceof Date 
            ? token.emailVerified 
            : null;
      }
      return session;
    },
  },
  // Seguridad adicional
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
});
