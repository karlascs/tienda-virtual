const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});
const PORT = process.env.PORT || 8080;

// Configuración de CORS para permitir solicitudes desde Vercel
app.use(cors({
  origin: [
    'https://iza-y-cas.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Servir archivos estáticos (imágenes)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend Railway funcionando' });
});

// Debug: Listar todas las categorías (temporal)
app.get('/api/debug/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    res.json({
      success: true,
      total: categories.length,
      categories: categories.map(cat => ({
        name: cat.name,
        slug: cat.slug,
        productCount: cat._count.products
      }))
    });
  } catch (error) {
    console.error('Error en debug:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========== CATEGORÍAS ==========
app.get('/api/categories', async (req, res) => {
  try {
    console.log('📂 Obteniendo categorías...');
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    console.log(`✅ ${categories.length} categorías encontradas`);
    res.json(categories);
  } catch (error) {
    console.error('❌ Error al obtener categorías:', error);
    res.status(500).json({ 
      error: 'Error al obtener categorías',
      details: error.message 
    });
  }
});

app.get('/api/categories/:slug', async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug }
    });
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
});

// ========== PRODUCTOS ==========
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, inStock } = req.query;
    
    console.log('🛍️  Obteniendo productos con filtros:', { category, search, minPrice, maxPrice, inStock });
    
    const where = {};
    
    if (category) {
      // Normalizar el slug de entrada: eliminar guiones, espacios, etc.
      const normalizedInput = category.toLowerCase()
        .replace(/[-_\s]+/g, '') // Quita guiones, guiones bajos y espacios
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // Quita tildes
      
      console.log(`🔍 Buscando categoría: "${category}" → normalizado: "${normalizedInput}"`);
      
      // Buscar la categoría de múltiples formas
      const categoryRecord = await prisma.category.findFirst({
        where: {
          OR: [
            // Búsqueda exacta por slug original
            { slug: category },
            // Búsqueda por slug con guiones
            { slug: category.replace(/\s+/g, '-') },
            // Búsqueda por slug sin guiones ni espacios
            { slug: normalizedInput },
            // Búsqueda por nombre (case insensitive)
            { name: { equals: category, mode: 'insensitive' } },
            // Búsqueda por nombre con espacios
            { name: { equals: category.replace(/-/g, ' '), mode: 'insensitive' } }
          ]
        }
      });
      
      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
        console.log(`✅ Categoría encontrada: "${categoryRecord.name}" (slug: ${categoryRecord.slug}, ID: ${categoryRecord.id})`);
      } else {
        console.log(`❌ Categoría "${category}" no encontrada después de probar múltiples variantes`);
        // Si no se encuentra la categoría, devolver array vacío
        return res.json([]);
      }
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    
    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ ${products.length} productos encontrados`);
    res.json(products);
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos',
      details: error.message 
    });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        category: true
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// ========== BANNERS ==========
app.get('/api/banners', async (req, res) => {
  try {
    const { active } = req.query;
    
    console.log('🎨 Obteniendo banners...');
    
    const where = active === 'true' ? { isActive: true } : {};
    
    const banners = await prisma.banner.findMany({
      where,
      orderBy: { order: 'asc' }
    });
    
    console.log(`✅ ${banners.length} banners encontrados`);
    
    // Devolver en formato esperado por el frontend
    res.json({
      success: true,
      data: banners
    });
  } catch (error) {
    console.error('❌ Error al obtener banners:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener banners',
      details: error.message 
    });
  }
});

// ========== ÓRDENES ==========
app.post('/api/orders', async (req, res) => {
  try {
    const { items, total, customerInfo } = req.body;
    
    const order = await prisma.order.create({
      data: {
        total,
        status: 'PENDING',
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        shippingAddress: customerInfo.address,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    res.json(order);
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ error: 'Error al crear orden' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({ error: 'Error al obtener orden' });
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Backend Railway escuchando en puerto ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  
  // Verificar conexión a base de datos
  try {
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos PostgreSQL');
    
    // Mostrar estadísticas
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    console.log(`📊 Base de datos: ${categoryCount} categorías, ${productCount} productos`);
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});
