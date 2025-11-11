/**
 * Script para verificar y crear usuario administrador
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    console.log('🔍 Verificando usuario administrador...\n');

    // Buscar administradores
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (admins.length > 0) {
      console.log('✅ Usuarios administradores encontrados:\n');
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   ID: ${admin.id}`);
        console.log(`   Creado: ${admin.createdAt.toLocaleDateString()}\n`);
      });
    } else {
      console.log('❌ No se encontraron usuarios administradores\n');
      console.log('📝 Creando usuario administrador...\n');

      // Crear admin por defecto
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      
      const admin = await prisma.user.create({
        data: {
          name: 'Administrador IZA&CAS',
          email: 'admin@izacas.com',
          hashedPassword,
          role: 'ADMIN',
          emailVerified: true
        }
      });

      console.log('✅ Usuario administrador creado:\n');
      console.log(`   Nombre: ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Contraseña: Admin123!`);
      console.log(`\n⚠️  IMPORTANTE: Cambia esta contraseña después de iniciar sesión\n`);
    }

    // Mostrar todos los usuarios
    const totalUsers = await prisma.user.count();
    console.log(`\n📊 Total de usuarios en la base de datos: ${totalUsers}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
