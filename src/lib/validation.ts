/**
 * Sistema de Validación Avanzada - IZA&CAS E-commerce
 * Esquemas de validación reutilizables con Zod
 */

import { z } from 'zod';

// ============================================
// VALIDACIONES BÁSICAS
// ============================================

export const safeStringSchema = z.string()
  .max(500, 'El texto es demasiado largo (máximo 500 caracteres)')
  .trim();

export const safeTextSchema = z.string()
  .max(5000, 'El texto es demasiado largo (máximo 5000 caracteres)')
  .trim();

export const safeEmailSchema = z.string()
  .email('Email inválido')
  .max(255, 'Email demasiado largo')
  .toLowerCase()
  .trim();

// ============================================
// VALIDACIÓN DE CONTRASEÑAS
// ============================================

export const passwordSchema = z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(128, 'La contraseña es demasiado larga (máximo 128 caracteres)')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial (!@#$%^&*...)');

// ============================================
// VALIDACIÓN DE TELÉFONOS
// ============================================

// Teléfono chileno: +56912345678 o 912345678
export const phoneSchema = z.string()
  .regex(
    /^(\+?56)?[2-9]\d{8}$/,
    'Teléfono inválido. Formato: +56912345678 o 912345678'
  )
  .transform(phone => {
    // Normalizar: agregar +56 si no lo tiene
    return phone.startsWith('+56') ? phone : `+56${phone}`;
  });

// ============================================
// VALIDACIÓN DE RUT CHILENO
// ============================================

export const rutSchema = z.string()
  .regex(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, 'RUT inválido. Formato: 12.345.678-9')
  .refine((rut) => {
    // Validar dígito verificador
    const cleanRut = rut.replace(/\./g, '').replace('-', '');
    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1).toUpperCase();
    
    let sum = 0;
    let multiplier = 2;
    
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const expectedDv = 11 - (sum % 11);
    const finalDv = expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : expectedDv.toString();
    
    return dv === finalDv;
  }, 'RUT inválido: dígito verificador incorrecto');

// ============================================
// VALIDACIÓN DE PRECIOS Y NÚMEROS
// ============================================

export const priceSchema = z.number()
  .positive('El precio debe ser mayor a cero')
  .max(999999999, 'El precio es demasiado alto')
  .refine(
    (price) => Number.isFinite(price) && price === Math.round(price * 100) / 100,
    'El precio debe tener máximo 2 decimales'
  );

export const quantitySchema = z.number()
  .int('La cantidad debe ser un número entero')
  .positive('La cantidad debe ser mayor a cero')
  .max(9999, 'La cantidad es demasiado alta');

export const discountSchema = z.number()
  .int('El descuento debe ser un número entero')
  .min(0, 'El descuento no puede ser negativo')
  .max(100, 'El descuento no puede ser mayor a 100%');

// ============================================
// VALIDACIÓN DE URLs E IMÁGENES
// ============================================

export const imageUrlSchema = z.string()
  .url('URL de imagen inválida')
  .regex(/\.(jpg|jpeg|png|gif|webp|avif)$/i, 'La URL debe apuntar a una imagen válida');

export const urlSchema = z.string()
  .url('URL inválida')
  .max(2048, 'La URL es demasiado larga');

// ============================================
// VALIDACIÓN DE FECHAS
// ============================================

export const futureDateSchema = z.date()
  .refine((date) => date > new Date(), 'La fecha debe ser futura');

export const pastDateSchema = z.date()
  .refine((date) => date < new Date(), 'La fecha debe ser pasada');

export const dateRangeSchema = z.object({
  start: z.date(),
  end: z.date(),
}).refine(
  (data) => data.end > data.start,
  'La fecha de fin debe ser posterior a la fecha de inicio'
);

// ============================================
// ESQUEMAS DE USUARIO
// ============================================

export const registerUserSchema = z.object({
  name: safeStringSchema.min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: safeEmailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  phone: phoneSchema.optional(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  }
);

export const loginUserSchema = z.object({
  email: safeEmailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const updateUserSchema = z.object({
  name: safeStringSchema.min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  phone: phoneSchema.optional(),
  address: safeStringSchema.optional(),
  city: safeStringSchema.optional(),
  zipCode: z.string().regex(/^\d{7}$/, 'Código postal inválido (7 dígitos)').optional(),
});

// ============================================
// ESQUEMAS DE PRODUCTOS
// ============================================

export const createProductSchema = z.object({
  name: safeStringSchema.min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: safeTextSchema.optional(),
  price: priceSchema,
  originalPrice: priceSchema.optional(),
  discount: discountSchema.optional(),
  brand: safeStringSchema.optional(),
  model: safeStringSchema.optional(),
  features: z.array(safeStringSchema).max(20, 'Máximo 20 características'),
  images: z.array(imageUrlSchema).min(1, 'Debe incluir al menos una imagen').max(10, 'Máximo 10 imágenes'),
  stock: quantitySchema,
  categoryId: z.string().cuid('ID de categoría inválido'),
  isFeatured: z.boolean().default(false),
});

export const updateProductSchema = createProductSchema.partial();

// ============================================
// ESQUEMAS DE ÓRDENES
// ============================================

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().cuid('ID de producto inválido'),
      quantity: quantitySchema,
    })
  ).min(1, 'Debe incluir al menos un producto'),
  shippingName: safeStringSchema.min(2, 'Nombre inválido'),
  shippingEmail: safeEmailSchema,
  shippingPhone: phoneSchema,
  shippingAddress: safeStringSchema.min(5, 'Dirección inválida'),
  shippingCity: safeStringSchema.min(2, 'Ciudad inválida'),
  shippingZip: z.string().regex(/^\d{7}$/, 'Código postal inválido (7 dígitos)'),
  notes: safeTextSchema.optional(),
});

// ============================================
// ESQUEMAS DE RESEÑAS
// ============================================

export const createReviewSchema = z.object({
  productId: z.string().cuid('ID de producto inválido'),
  rating: z.number().int().min(1, 'Calificación mínima: 1').max(5, 'Calificación máxima: 5'),
  title: safeStringSchema.max(100, 'Título demasiado largo').optional(),
  comment: safeTextSchema.min(10, 'El comentario debe tener al menos 10 caracteres'),
});

// ============================================
// ESQUEMAS DE BÚSQUEDA Y FILTROS
// ============================================

export const searchQuerySchema = z.object({
  query: safeStringSchema.min(1, 'Búsqueda vacía').optional(),
  category: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().positive().optional(),
  sortBy: z.enum(['price-asc', 'price-desc', 'name', 'rating', 'newest']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
}).refine(
  (data) => {
    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
      return data.maxPrice > data.minPrice;
    }
    return true;
  },
  {
    message: 'El precio máximo debe ser mayor al mínimo',
    path: ['maxPrice'],
  }
);

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

/**
 * Sanitiza un string removiendo caracteres peligrosos
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, ''); // Remover event handlers
}

/**
 * Valida que un string no contenga código malicioso
 */
export function isStringSafe(input: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Valida formato de SKU de producto
 */
export function isValidSKU(sku: string): boolean {
  // Formato: SKU-XXXXX-###
  return /^SKU-[A-Z0-9]{3,10}-\d{3,5}$/.test(sku);
}

/**
 * Normaliza un slug para URLs
 */
export function normalizeSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .replace(/^-|-$/g, ''); // Remover guiones al inicio/fin
}
