/**
 * Página de gestión de productos para admin
 */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import styles from './ProductsManagement.module.css'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  images: string[]
  isActive: boolean
  category: {
    name: string
    slug: string
  }
}

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showModal, setShowModal] = useState(false)
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    images: [] as string[],
    isActive: true
  })
  const [imageInput, setImageInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [categoryFilter])
  
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: (editingProduct as any).description || '',
        price: editingProduct.price.toString(),
        stock: editingProduct.stock.toString(),
        categoryId: (editingProduct as any).categoryId || '',
        images: editingProduct.images,
        isActive: editingProduct.isActive
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        images: [],
        isActive: true
      })
    }
  }, [editingProduct, showModal])
  
  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [categoryFilter])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const url = categoryFilter === 'all' 
        ? '/api/products'
        : `/api/products?category=${categoryFilter}`
      
      const res = await fetch(url)
      const data = await res.json()
      
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        alert('Producto eliminado exitosamente')
        loadProducts()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error al eliminar producto')
    }
  }

  const handleToggleActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          isActive: !product.isActive
        })
      })

      if (res.ok) {
        loadProducts()
      }
    } catch (error) {
      console.error('Error toggling product status:', error)
    }
  }
  
  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }))
      setImageInput('')
    }
  }
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploading(true)
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formDataToUpload = new FormData()
        formDataToUpload.append('file', file)
        
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formDataToUpload
        })
        
        const data = await res.json()
        
        if (data.success) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, data.url]
          }))
        } else {
          alert(`Error al subir ${file.name}: ${data.error}`)
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error)
      alert('Error al subir las imágenes')
    } finally {
      setUploading(false)
      // Resetear input
      e.target.value = ''
    }
  }
  
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: formData.categoryId,
        images: formData.images,
        isActive: formData.isActive
      }
      
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products'
      
      const method = editingProduct ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      
      if (res.ok) {
        alert(editingProduct ? 'Producto actualizado' : 'Producto creado')
        setShowModal(false)
        loadProducts()
      } else {
        const error = await res.json()
        alert(`Error: ${error.message || 'Error al guardar'}`)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error al guardar el producto')
    } finally {
      setSaving(false)
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Gestión de Productos</h1>
          <button 
            className={styles.addBtn}
            onClick={() => {
              setEditingProduct(null)
              setShowModal(true)
            }}
          >
            + Nuevo Producto
          </button>
        </div>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.categorySelect}
          >
            <option value="all">Todas las categorías</option>
            <option value="tecnologia">Tecnología</option>
            <option value="electrohogar">Electrohogar</option>
            <option value="herramientas">Herramientas</option>
            <option value="hogar">Hogar</option>
            <option value="actividad">Actividad</option>
            <option value="cuidadopersonal">Cuidado Personal</option>
            <option value="juguetes">Juguetes</option>
          </select>
        </div>

        {loading ? (
          <div className={styles.loading}>Cargando productos...</div>
        ) : (
          <div className={styles.productsTable}>
            <table>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      {product.images[0] && (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className={styles.productImage}
                        />
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <span className={product.stock < 5 ? styles.lowStock : ''}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`${styles.statusBadge} ${product.isActive ? styles.active : styles.inactive}`}
                      >
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => {
                            setEditingProduct(product)
                            setShowModal(true)
                          }}
                          className={styles.editBtn}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className={styles.deleteBtn}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className={styles.emptyState}>
                No se encontraron productos
              </div>
            )}
          </div>
        )}
        
        {/* Modal de Agregar/Editar Producto */}
        {showModal && (
          <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                <button 
                  className={styles.closeBtn}
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Nombre */}
                <div className={styles.formGroup}>
                  <label htmlFor="name">Nombre del Producto *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Laptop HP Pavilion"
                  />
                </div>
                
                {/* Descripción */}
                <div className={styles.formGroup}>
                  <label htmlFor="description">Descripción</label>
                  <textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe el producto..."
                  />
                </div>
                
                {/* Precio y Stock */}
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="price">Precio de Venta (IVA incluido) *</label>
                    <input
                      id="price"
                      type="number"
                      step="1"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="19900"
                    />
                    <span className={styles.helpText}>💡 Este es el precio que ve el cliente</span>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="stock">Stock *</label>
                    <input
                      id="stock"
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      placeholder="10"
                    />
                  </div>
                </div>
                
                {/* Desglose de Precios */}
                {formData.price && parseFloat(formData.price) > 0 && (
                  <div className={styles.priceBreakdown}>
                    <h3>💰 Desglose de Cobro al Cliente</h3>
                    <div className={styles.breakdownContent}>
                      <div className={styles.breakdownRow}>
                        <span className={styles.label}>Valor Neto (sin IVA):</span>
                        <span className={styles.value}>
                          ${Math.round(parseFloat(formData.price) / 1.19).toLocaleString('es-CL')}
                        </span>
                      </div>
                      <div className={styles.breakdownRow}>
                        <span className={styles.label}>IVA (19%):</span>
                        <span className={styles.value}>
                          ${Math.round(parseFloat(formData.price) - (parseFloat(formData.price) / 1.19)).toLocaleString('es-CL')}
                        </span>
                      </div>
                      <div className={styles.breakdownRow}>
                        <span className={styles.label}>Precio Producto:</span>
                        <span className={styles.value}>
                          ${parseFloat(formData.price).toLocaleString('es-CL')}
                        </span>
                      </div>
                      <div className={styles.breakdownDivider}></div>
                      <div className={styles.breakdownRow}>
                        <span className={styles.label}>Comisión Transbank (2.95%):</span>
                        <span className={styles.value}>
                          ${Math.round(parseFloat(formData.price) * 0.0295).toLocaleString('es-CL')}
                        </span>
                      </div>
                      <div className={styles.breakdownRow}>
                        <span className={styles.label}>IVA sobre comisión (19%):</span>
                        <span className={styles.value}>
                          ${Math.round(Math.round(parseFloat(formData.price) * 0.0295) * 0.19).toLocaleString('es-CL')}
                        </span>
                      </div>
                      <div className={styles.breakdownDivider}></div>
                      <div className={`${styles.breakdownRow} ${styles.total}`}>
                        <span className={styles.label}>💳 TOTAL A COBRAR:</span>
                        <span className={styles.value}>
                          ${Math.round(
                            parseFloat(formData.price) + 
                            (parseFloat(formData.price) * 0.0295 * 1.19)
                          ).toLocaleString('es-CL')}
                        </span>
                      </div>
                      <div className={styles.breakdownNote}>
                        ℹ️ Precio final del producto con comisión Transbank incluida (envío se calcula al momento de compra)
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Categoría */}
                <div className={styles.formGroup}>
                  <label htmlFor="category">Categoría *</label>
                  <select
                    id="category"
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Imágenes */}
                <div className={styles.formGroup}>
                  <label>Imágenes del Producto</label>
                  
                  {/* Subir archivo */}
                  <div className={styles.uploadArea}>
                    <input
                      id="fileUpload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="fileUpload" className={styles.uploadLabel}>
                      {uploading ? (
                        <>
                          <span>⏳</span>
                          <span>Subiendo imágenes...</span>
                        </>
                      ) : (
                        <>
                          <span>📁</span>
                          <span>Seleccionar archivos de imagen</span>
                          <span className={styles.uploadHint}>JPG, PNG, WebP o GIF (máx. 5MB)</span>
                        </>
                      )}
                    </label>
                  </div>
                  
                  {/* O agregar por URL */}
                  <div className={styles.divider}>
                    <span>O agregar URL manualmente</span>
                  </div>
                  
                  <div className={styles.imageInput}>
                    <input
                      type="text"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      placeholder="URL de la imagen (ej: /images/producto.jpg)"
                    />
                    <button 
                      type="button"
                      onClick={handleAddImage}
                      className={styles.addImageBtn}
                    >
                      + Agregar
                    </button>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className={styles.imagesList}>
                      {formData.images.map((img, index) => (
                        <div key={index} className={styles.imageItem}>
                          <img src={img} alt={`Preview ${index + 1}`} />
                          <button 
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className={styles.removeImageBtn}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className={styles.helpText}>
                    💡 Tip: Las imágenes deben estar en la carpeta <code>public/images/</code>
                  </p>
                </div>
                
                {/* Estado */}
                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    />
                    <span>Producto activo (visible en la tienda)</span>
                  </label>
                </div>
                
                {/* Botones */}
                <div className={styles.formActions}>
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={styles.cancelBtn}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className={styles.submitBtn}
                  >
                    {saving ? 'Guardando...' : editingProduct ? 'Actualizar' : 'Crear Producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
