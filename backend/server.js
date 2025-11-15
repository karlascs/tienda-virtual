const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'IZA&CAS Backend API'
  });
});

// ============ PRODUCTOS ============
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;
    
    const where = {};
    if (category) where.categoryId = category;
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
    
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true
      }
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        images: true
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// ============ CATEGORÍAS ============
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// ============ CARRITO ============
app.post('/api/cart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity
      },
      include: {
        product: {
          include: {
            images: true
          }
        }
      }
    });
    
    res.json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
});

app.get('/api/cart/:userId', async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.params.userId },
      include: {
        product: {
          include: {
            images: true
          }
        }
      }
    });
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});

// ============ ÓRDENES ============
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    
    const order = await prisma.order.create({
      data: {
        ...orderData,
        items: {
          create: orderData.items
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
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error al crear orden' });
  }
});

// ============ ADMIN - SEED PRODUCTS ============
app.post('/api/admin/seed-products', async (req, res) => {
  try {
    // TODO: Agregar autenticación de admin aquí
    const { products } = req.body;
    
    const result = await prisma.product.createMany({
      data: products,
      skipDuplicates: true
    });
    
    res.json({ 
      message: 'Productos cargados exitosamente',
      count: result.count
    });
  } catch (error) {
    console.error('Error seeding products:', error);
    res.status(500).json({ error: 'Error al cargar productos' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Backend API escuchando en http://${HOST}:${PORT}`);
  console.log(`📡 Frontend permitido: ${process.env.FRONTEND_URL || '*'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
