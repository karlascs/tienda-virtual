/**
 * Página de gestión de categorías para admin
 */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import styles from './CategoriesManagement.module.css'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  _count: {
    products: number
  }
}

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: ''
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/categories')
      const data = await res.json()
      
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = editingCategory
      ? `/api/admin/categories/${editingCategory.id}`
      : '/api/admin/categories'

    const method = editingCategory ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success) {
        alert(editingCategory ? 'Categoría actualizada' : 'Categoría creada')
        setShowModal(false)
        resetForm()
        loadCategories()
      } else {
        alert(data.error || 'Error al guardar categoría')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Error al guardar categoría')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (data.success) {
        alert('Categoría eliminada')
        loadCategories()
      } else {
        alert(data.error || 'Error al eliminar categoría')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error al eliminar categoría')
    }
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || ''
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: ''
    })
  }
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    
    try {
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
          image: data.url
        }))
      } else {
        alert(`Error al subir imagen: ${data.error}`)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error al subir la imagen')
    } finally {
      setUploading(false)
      // Resetear input
      e.target.value = ''
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Gestión de Categorías</h1>
          <button 
            className={styles.addBtn}
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
          >
            + Nueva Categoría
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>Cargando categorías...</div>
        ) : (
          <div className={styles.categoriesGrid}>
            {categories.map(category => (
              <div key={category.id} className={styles.categoryCard}>
                {category.image && (
                  <div className={styles.categoryImage}>
                    <img src={category.image} alt={category.name} />
                  </div>
                )}
                <div className={styles.categoryContent}>
                  <h3>{category.name}</h3>
                  <p className={styles.categorySlug}>/{category.slug}</p>
                  {category.description && (
                    <p className={styles.categoryDescription}>{category.description}</p>
                  )}
                  <div className={styles.categoryStats}>
                    <span className={styles.productCount}>
                      {category._count.products} productos
                    </span>
                  </div>
                </div>
                <div className={styles.categoryActions}>
                  <button
                    onClick={() => openEditModal(category)}
                    className={styles.editBtn}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className={styles.deleteBtn}
                    disabled={category._count.products > 0}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de crear/editar */}
        {showModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
                <button 
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className={styles.closeBtn}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: generateSlug(e.target.value)
                      })
                    }}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Imagen de la Categoría</label>
                  
                  {/* Subir archivo */}
                  <div className={styles.uploadArea}>
                    <input
                      id="categoryFileUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="categoryFileUpload" className={styles.uploadLabel}>
                      {uploading ? (
                        <>
                          <span>⏳</span>
                          <span>Subiendo imagen...</span>
                        </>
                      ) : (
                        <>
                          <span>📁</span>
                          <span>Seleccionar archivo de imagen</span>
                          <span className={styles.uploadHint}>JPG, PNG, WebP o GIF (máx. 5MB)</span>
                        </>
                      )}
                    </label>
                  </div>
                  
                  {/* O agregar por URL */}
                  <div className={styles.divider}>
                    <span>O agregar URL manualmente</span>
                  </div>
                  
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/categorias/tecnologia.png"
                  />
                  
                  {formData.image && (
                    <div className={styles.imagePreview}>
                      <img src={formData.image} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitBtn}>
                    {editingCategory ? 'Actualizar' : 'Crear'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className={styles.cancelBtn}
                  >
                    Cancelar
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
