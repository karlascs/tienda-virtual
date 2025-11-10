/**
 * Página de gestión de banners para admin
 */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import styles from './BannersManagement.module.css'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string
  link: string | null
  order: number
  isActive: boolean
}

export default function BannersManagementPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    link: ''
  })
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/banners')
      const data = await res.json()
      
      if (data.success) {
        setBanners(data.data)
      }
    } catch (error) {
      console.error('Error loading banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = editingBanner
      ? `/api/admin/banners/${editingBanner.id}`
      : '/api/admin/banners'

    const method = editingBanner ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success) {
        alert(editingBanner ? 'Banner actualizado' : 'Banner creado')
        setShowModal(false)
        resetForm()
        loadBanners()
      } else {
        alert(data.error || 'Error al guardar banner')
      }
    } catch (error) {
      console.error('Error saving banner:', error)
      alert('Error al guardar banner')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este banner?')) return

    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (data.success) {
        alert('Banner eliminado')
        loadBanners()
      } else {
        alert(data.error || 'Error al eliminar banner')
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
      alert('Error al eliminar banner')
    }
  }

  const handleToggleActive = async (banner: Banner) => {
    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...banner,
          isActive: !banner.isActive
        })
      })

      if (res.ok) {
        loadBanners()
      }
    } catch (error) {
      console.error('Error toggling banner status:', error)
    }
  }

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl,
      link: banner.link || ''
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingBanner(null)
    setFormData({
      title: '',
      subtitle: '',
      imageUrl: '',
      link: ''
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
          imageUrl: data.url
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

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === index) return

    const newBanners = [...banners]
    const draggedBanner = newBanners[draggedIndex]
    
    newBanners.splice(draggedIndex, 1)
    newBanners.splice(index, 0, draggedBanner)
    
    setBanners(newBanners)
    setDraggedIndex(index)
  }

  const handleDragEnd = async () => {
    if (draggedIndex === null) return

    // Actualizar el orden en el servidor
    try {
      const updatePromises = banners.map((banner, index) =>
        fetch(`/api/admin/banners/${banner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...banner,
            order: index
          })
        })
      )

      await Promise.all(updatePromises)
      alert('Orden actualizado')
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error al actualizar orden')
    }

    setDraggedIndex(null)
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Gestión de Banners</h1>
            <p className={styles.subtitle}>Administra los banners del carousel de la página principal</p>
          </div>
          <button 
            className={styles.addBtn}
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
          >
            + Nuevo Banner
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>Cargando banners...</div>
        ) : (
          <div className={styles.bannersGrid}>
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={styles.bannerCard}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className={styles.dragHandle}>
                  ⋮⋮
                </div>

                <div className={styles.bannerPreview}>
                  <img src={banner.imageUrl} alt={banner.title} />
                  <div className={styles.bannerOverlay}>
                    <span className={styles.orderBadge}>Orden: {index + 1}</span>
                  </div>
                </div>

                <div className={styles.bannerContent}>
                  <h3>{banner.title}</h3>
                  {banner.subtitle && (
                    <p className={styles.bannerSubtitle}>{banner.subtitle}</p>
                  )}
                  {banner.link && (
                    <p className={styles.bannerLink}>
                      🔗 {banner.link}
                    </p>
                  )}

                  <div className={styles.bannerMeta}>
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`${styles.statusBadge} ${banner.isActive ? styles.active : styles.inactive}`}
                    >
                      {banner.isActive ? '✓ Activo' : '✕ Inactivo'}
                    </button>
                  </div>
                </div>

                <div className={styles.bannerActions}>
                  <button
                    onClick={() => openEditModal(banner)}
                    className={styles.editBtn}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className={styles.deleteBtn}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}

            {banners.length === 0 && (
              <div className={styles.emptyState}>
                <p>No hay banners creados</p>
                <button 
                  className={styles.addBtn}
                  onClick={() => {
                    resetForm()
                    setShowModal(true)
                  }}
                >
                  Crear primer banner
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal de crear/editar */}
        {showModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>{editingBanner ? 'Editar Banner' : 'Nuevo Banner'}</h2>
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
                  <label>Título *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Ofertas de Verano"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Subtítulo</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Ej: Hasta 50% de descuento"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Imagen del Banner *</label>
                  
                  {/* Subir archivo */}
                  <div className={styles.uploadArea}>
                    <input
                      id="bannerFileUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="bannerFileUpload" className={styles.uploadLabel}>
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
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="/bannerIZAyCAS.png"
                    required
                  />
                  {formData.imageUrl && (
                    <div className={styles.imagePreview}>
                      <img src={formData.imageUrl} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Enlace (opcional)</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="/products/tecnologia"
                  />
                  <small>Deja vacío si no quieres que el banner sea clickeable</small>
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitBtn}>
                    {editingBanner ? 'Actualizar' : 'Crear'}
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
