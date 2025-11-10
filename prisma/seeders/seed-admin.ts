import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Creando/actualizando usuario administrador...');

  // Datos del administrador
  const adminData = {
    name: 'Administrador IZA&CAS',
    email: 'admin@izacas.com',
    password: 'Admin123!', // Cambiar esta contraseña después del primer login
    phone: '+56912345678',
  };

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(adminData.password, 12);

  // Verificar si ya existe el usuario
  const existingUser = await prisma.user.findUnique({
    where: { email: adminData.email },
  });

  if (existingUser) {
    // Actualizar a ADMIN si existe
    await prisma.user.update({
      where: { email: adminData.email },
      data: {
        role: 'ADMIN',
        hashedPassword,
        emailVerified: true,
        name: adminData.name,
        phone: adminData.phone,
      },
    });
    console.log('✅ Usuario existente actualizado a ADMIN!');
  } else {
    // Crear nuevo admin
    await prisma.user.create({
      data: {
        name: adminData.name,
        email: adminData.email,
        hashedPassword,
        phone: adminData.phone,
        role: 'ADMIN',
        emailVerified: true,
      },
    });
    console.log('✅ Usuario administrador creado exitosamente!');
  }

  console.log('');
  console.log('📋 Credenciales de acceso:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📧 Email:      ${adminData.email}`);
  console.log(`🔑 Contraseña: ${adminData.password}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('⚠️  IMPORTANTE: Cambiar la contraseña después del primer login');
  console.log('🔗 Acceso al panel: http://localhost:3000/login');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error al crear administrador:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
