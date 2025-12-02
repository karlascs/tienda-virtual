/**
 * ========================================
 * SERVIDOR EXPRESS PARA IZA&CAS E-COMMERCE
 * ========================================
 * 
 * Este servidor actúa como backend API independiente para Railway.
 * Maneja todas las operaciones de base de datos y endpoints REST.
 * 
 * Características principales:
 * - API REST para productos, categorías, banners y órdenes
 * - Conexión a PostgreSQL mediante Prisma ORM
 * - CORS configurado para Vercel y desarrollo local
 * - Logging de queries y errores para debugging
 * - Manejo de errores global y cierre graceful
 * - Health check endpoint para monitoreo
 * 
 * Estructura de endpoints:
 * - GET  /health                    - Verificación de estado del servidor
 * - GET  /api/categories            - Listar todas las categorías
 * - GET  /api/categories/:slug      - Obtener categoría específica
 * - GET  /api/products              - Listar productos (con filtros)
 * - GET  /api/products/:id          - Obtener producto específico
 * - GET  /api/banners               - Listar banners promocionales
 * - POST /api/orders                - Crear nueva orden
 * - GET  /api/orders/:id            - Obtener orden específica
 * - GET  /api/debug/categories      - Debug: estadísticas de categorías
 * 
 * @requires express - Framework web para Node.js
 * @requires cors - Middleware para habilitar CORS
 * @requires @prisma/client - ORM para PostgreSQL
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Inicializar aplicación Express
const app = express();

// Inicializar cliente Prisma con logging habilitado para debugging
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'], // Registrar todas las queries, errores y advertencias
});

// Puerto configurable desde variables de entorno
const PORT = process.env.PORT || 8080;

// ========================================
// CONFIGURACIÓN DE MIDDLEWARE
// ========================================

// Configuración de CORS para permitir solicitudes desde frontend en Vercel y local
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

// Parser de JSON para manejar request bodies
app.use(express.json());

// ========================================
// ARCHIVOS ESTÁTICOS
// ========================================

/**
 * Servir imágenes de productos, categorías y banners
 * Ruta: /images/productos/, /images/categorias/, etc.
 */
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ========================================
// ENDPOINTS DE SISTEMA
// ========================================

/**
 * Health Check Endpoint
 * Verifica que el servidor esté funcionando correctamente
 * Usado por Railway para monitoreo de salud del servicio
 * 
 * @route GET /health
 * @returns {Object} Estado del servidor
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend Railway funcionando' });
});

/**
 * Debug: Listar estadísticas de categorías
 * Endpoint temporal para debugging de categorías y productos
 * Muestra el conteo de productos por categoría
 * 
 * @route GET /api/debug/categories
 * @returns {Object} Lista de categorías con conteo de productos
 */
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

// ========================================
// ENDPOINTS DE CATEGORÍAS
// ========================================

/**
 * Obtener todas las categorías
 * Lista todas las categorías disponibles ordenadas alfabéticamente
 * 
 * @route GET /api/categories
 * @returns {Array<Category>} Lista de categorías
 * @example
 * // Respuesta:
 * // [
 * //   { id: 1, name: "Tecnología", slug: "tecnologia", ... },
 * //   { id: 2, name: "Hogar", slug: "hogar", ... }
 * // ]
 */
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

/**
 * Obtener categoría por slug
 * Devuelve los detalles de una categoría específica
 * 
 * @route GET /api/categories/:slug
 * @param {string} slug - Identificador único de la categoría (ej: "tecnologia")
 * @returns {Category} Datos de la categoría
 * @throws {404} Si la categoría no existe
 */
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

// ========================================
// ENDPOINTS DE PRODUCTOS
// ========================================

/**
 * Obtener productos con filtros avanzados
 * Soporta múltiples criterios de búsqueda y filtrado
 * 
 * @route GET /api/products
 * @queryparam {string} [category] - Slug de categoría para filtrar
 * @queryparam {string} [search] - Término de búsqueda (nombre o descripción)
 * @queryparam {number} [minPrice] - Precio mínimo
 * @queryparam {number} [maxPrice] - Precio máximo
 * @queryparam {boolean} [inStock] - Solo productos con stock disponible
 * @returns {Array<Product>} Lista de productos que cumplen los criterios
 * @example
 * // GET /api/products?category=tecnologia&minPrice=50000&inStock=true
 * // Retorna productos de tecnología con precio >= 50000 y stock > 0
 */
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

/**
 * Obtener producto por ID
 * Devuelve los detalles completos de un producto incluyendo su categoría
 * 
 * @route GET /api/products/:id
 * @param {number} id - ID único del producto
 * @returns {Product} Datos completos del producto con categoría
 * @throws {404} Si el producto no existe
 */
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        category: true // Incluir información de la categoría
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

// ========================================
// ENDPOINTS DE BANNERS PROMOCIONALES
// ========================================

/**
 * Obtener banners promocionales
 * Lista banners del carrusel principal, opcionalmente solo los activos
 * 
 * @route GET /api/banners
 * @queryparam {boolean} [active] - Filtrar solo banners activos
 * @returns {Object} Respuesta con lista de banners ordenados
 * @example
 * // GET /api/banners?active=true
 * // Retorna solo banners activos ordenados por campo 'order'
 */
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

// ========================================
// ENDPOINTS DE ÓRDENES DE COMPRA
// ========================================

/**
 * Crear nueva orden de compra
 * Procesa una compra completa con items y datos del cliente
 * 
 * @route POST /api/orders
 * @body {Array} items - Items del pedido [{productId, quantity, price}]
 * @body {number} total - Total de la orden
 * @body {Object} customerInfo - Datos del cliente {name, email, phone, address}
 * @returns {Order} Orden creada con items y productos relacionados
 */
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

/**
 * Obtener orden por ID
 * Devuelve los detalles completos de una orden incluyendo items y productos
 * 
 * @route GET /api/orders/:id
 * @param {number} id - ID único de la orden
 * @returns {Order} Orden completa con items y productos relacionados
 * @throws {404} Si la orden no existe
 */
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        items: {
          include: {
            product: true // Incluir detalles del producto en cada item
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

// ========================================
// MANEJO DE ERRORES GLOBAL
// ========================================

/**
 * Middleware de manejo de errores
 * Captura todos los errores no manejados y devuelve respuesta 500
 */
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ========================================
// INICIO DEL SERVIDOR
// ========================================

/**
 * Iniciar servidor Express
 * Configura el puerto, conecta a la base de datos y muestra estadísticas
 */
app.listen(PORT, async () => {
  console.log(`🚀 Backend Railway escuchando en puerto ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  
  // Verificar conexión a base de datos al iniciar
  try {
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos PostgreSQL');
    
    // Mostrar estadísticas iniciales de la base de datos
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    console.log(`📊 Base de datos: ${categoryCount} categorías, ${productCount} productos`);
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
});

// ========================================
// MANEJO DE CIERRE GRACEFUL
// ========================================

/**
 * Manejo de señal SIGINT (Ctrl+C)
 * Cierra las conexiones limpiamente antes de terminar el proceso
 */
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor gracefully...');
  await prisma.$disconnect();
  console.log('✅ Conexiones cerradas correctamente');
  process.exit(0);
});
