const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Creando usuario administrador para Railway...');
  
  try {
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    // Crear o actualizar usuario admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@izacas.com' },
      update: {
        hashedPassword: hashedPassword,
        role: 'ADMIN',
      },
      create: {
        name: 'Admin IZA&CAS',
        email: 'admin@izacas.com',
        hashedPassword: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });
    
    console.log('✅ Usuario administrador creado/actualizado exitosamente!');
    console.log('');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: Admin123!');
    console.log('👤 Role:', admin.role);
    console.log('');
    console.log('🚀 Ahora puedes iniciar sesión en tu app de Railway');
    
  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
