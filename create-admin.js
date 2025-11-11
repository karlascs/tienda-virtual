const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  console.log('👤 Creando usuario administrador...\n')

  // Verificar si ya existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@izacas.com' }
  })

  if (existingAdmin) {
    console.log('⚠️  El usuario admin@izacas.com ya existe')
    console.log('📧 Email:', existingAdmin.email)
    console.log('👤 Nombre:', existingAdmin.name)
    console.log('🔑 Rol:', existingAdmin.role)
    return
  }

  // Crear nuevo admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@izacas.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log('✅ Usuario administrador creado exitosamente!\n')
  console.log('📧 Email:', admin.email)
  console.log('🔑 Contraseña: admin123')
  console.log('👤 Nombre:', admin.name)
  console.log('🎯 Rol:', admin.role)
  console.log('\n🔐 Usa estas credenciales para acceder al panel admin')
  console.log('🌐 URL: http://localhost:3000/login')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
