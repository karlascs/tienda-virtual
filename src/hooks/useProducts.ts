/**
 * Hook personalizado para consumir la API de productos
 * Reemplaza los imports estáticos de products.ts
 */

import { useState, useEffect } from 'react'
import type { Product, Category } from '@/types/product'

// Re-exportar los tipos para facilitar imports
export type { Product, Category } from '@/types/product'

interface UseProductsResult {
  products: Product[]
  loading: boolean
  error: string | null
  refetch: () => void
}

interface UseCategoriesResult {
  categories: Category[]
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Hook para obtener todos los productos o filtrados por categoría
 */
export function useProducts(categorySlug?: string): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const url = categorySlug 
        ? `/api/products?category=${categorySlug}` 
        : '/api/products'
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Error al cargar productos')
      }
      
      const result = await response.json()
      
      // El backend puede devolver array directo o { data: [...] }
      const data = Array.isArray(result) ? result : (result.data || [])
      
      // Transformar productos: agregar image y convertir category a string
      const productsWithImage = data.map((product: any) => ({
        ...product,
        image: product.images?.[0] || '',
        category: typeof product.category === 'object' 
          ? product.category.slug 
          : product.category
      }))
      
      setProducts(productsWithImage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching products:', err)
      setProducts([]) // Asegurar que siempre sea un array
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [categorySlug])

  return { products, loading, error, refetch: fetchProducts }
}

/**
 * Hook para obtener un producto por ID o slug
 */
export function useProduct(idOrSlug: string): UseProductsResult & { product: Product | null } {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/products/${idOrSlug}`)
      
      if (!response.ok) {
        throw new Error('Producto no encontrado')
      }
      
      const result = await response.json()
      
      // La API individual devuelve el producto directamente (sin success/data wrapper)
      const data = result
      
      // Agregar image y transformar category
      const productWithImage = {
        ...data,
        image: data.images?.[0] || '',
        category: typeof data.category === 'object' 
          ? data.category.slug 
          : data.category
      }
      
      setProduct(productWithImage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching product:', err)
      setProduct(null) // Asegurar que sea null en caso de error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (idOrSlug) {
      fetchProduct()
    }
  }, [idOrSlug])

  return { 
    products: product ? [product] : [], 
    product, 
    loading, 
    error, 
    refetch: fetchProduct 
  }
}

/**
 * Hook para obtener productos destacados
 */
export function useFeaturedProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/products?featured=true')
      
      if (!response.ok) {
        throw new Error('Error al cargar productos destacados')
      }
      
      const result = await response.json()
      
      // El backend puede devolver array directo o { data: [...] }
      const data = Array.isArray(result) ? result : (result.data || [])
      
      // Transformar productos: agregar image y convertir category a string
      const productsWithImage = data.map((product: any) => ({
        ...product,
        image: product.images?.[0] || '',
        category: typeof product.category === 'object' 
          ? product.category.slug 
          : product.category
      }))
      
      setProducts(productsWithImage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching featured products:', err)
      setProducts([]) // Asegurar que siempre sea un array
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  return { products, loading, error, refetch: fetchFeaturedProducts }
}

/**
 * Hook para obtener todas las categorías
 */
export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/categories')
      
      if (!response.ok) {
        throw new Error('Error al cargar categorías')
      }
      
      const result = await response.json()
      
      // El backend devuelve directamente el array
      setCategories(Array.isArray(result) ? result : result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching categories:', err)
      setCategories([]) // Asegurar que siempre sea un array
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return { categories, loading, error, refetch: fetchCategories }
}

/**
 * Hook para buscar productos
 */
export function useSearchProducts(query: string): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchProducts = async () => {
    if (!query || query.trim().length < 2) {
      setProducts([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`)
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda')
      }
      
      const result = await response.json()
      
      // El backend puede devolver array directo o { data: [...] }
      const data = Array.isArray(result) ? result : (result.data || [])
      
      // Transformar productos: agregar image y convertir category a string
      const productsWithImage = data.map((product: any) => ({
        ...product,
        image: product.images?.[0] || '',
        category: typeof product.category === 'object' 
          ? product.category.slug 
          : product.category
      }))
      
      setProducts(productsWithImage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error searching products:', err)
      setProducts([]) // Asegurar que siempre sea un array
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchProducts()
    }, 300) // Debounce de 300ms

    return () => clearTimeout(debounceTimer)
  }, [query])

  return { products, loading, error, refetch: searchProducts }
}
