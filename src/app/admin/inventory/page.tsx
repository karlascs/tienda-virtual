/**
 * Página de Gestión de Inventario
 * Permite ver stock, hacer ajustes y ver historial de movimientos
 */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import styles from './Inventory.module.css'

interface Product {
  id: string
  name: string
  stock: number
  images: string[]
  category: {
    name: string
  }
  _count?: {
    inventoryMovements: number
  }
}

interface InventoryMovement {
  id: string
  type: string
  quantity: number
  previousStock: number
  newStock: number
  reason?: string
  notes?: string
  performedBy?: string
  createdAt: string
}

interface Stats {
  totalProducts: number
  lowStockCount: number
  outOfStockCount: number
  totalStock: number
  recentMovements: number
  topMovedProducts: any[]
  movementsByType: any[]
}

const MOVEMENT_TYPES = [
  { value: 'PURCHASE', label: 'Compra', icon: '📦' },
  { value: 'SALE', label: 'Venta', icon: '🛒' },
  { value: 'RETURN', label: 'Devolución', icon: '↩️' },
  { value: 'ADJUSTMENT', label: 'Ajuste', icon: '⚙️' },
  { value: 'DAMAGE', label: 'Daño', icon: '💔' },
  { value: 'LOSS', label: 'Pérdida', icon: '❌' },
  { value: 'INITIAL', label: 'Stock Inicial', icon: '🏁' }
]

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLowStock, setFilterLowStock] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Form states
  const [formData, setFormData] = useState({
    type: 'ADJUSTMENT',
    quantity: '',
    reason: '',
    notes: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadData()
  }, [filterLowStock, selectedCategory])

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

  const loadData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterLowStock) params.append('lowStock', 'true')
      if (selectedCategory !== 'all') params.append('categoryId', selectedCategory)
      
      const [productsRes, statsRes] = await Promise.all([
        fetch(`/api/admin/inventory?${params.toString()}`),
        fetch('/api/admin/inventory/stats')
      ])

      const productsData = await productsRes.json()
      const statsData = await statsRes.json()

      if (productsData.success) {
        setProducts(productsData.data)
      }
      if (statsData.success) {
        setStats(statsData.data)
      }
    } catch (error) {
      console.error('Error loading inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProductMovements = async (productId: string) => {
    try {
      const res = await fetch(`/api/admin/inventory?productId=${productId}`)
      const data = await res.json()
      if (data.success) {
        setMovements(data.data.inventoryMovements || [])
      }
    } catch (error) {
      console.error('Error loading movements:', error)
    }
  }

  const handleAdjust = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      type: 'ADJUSTMENT',
      quantity: '',
      reason: '',
      notes: ''
    })
    setShowModal(true)
  }

  const handleViewHistory = async (product: Product) => {
    setSelectedProduct(product)
    await loadProductMovements(product.id)
    setShowHistoryModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    setSaving(true)

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          type: formData.type,
          quantity: parseInt(formData.quantity),
          reason: formData.reason,
          notes: formData.notes
        })
      })

      const data = await res.json()

      if (data.success) {
        alert('Inventario actualizado correctamente')
        setShowModal(false)
        loadData()
      } else {
        alert(data.error || 'Error al actualizar inventario')
      }
    } catch (error) {
      console.error('Error updating inventory:', error)
      alert('Error al actualizar inventario')
    } finally {
      setSaving(false)
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Sin stock', className: styles.outOfStock }
    if (stock <= 5) return { label: 'Crítico', className: styles.critical }
    if (stock <= 10) return { label: 'Bajo', className: styles.low }
    return { label: 'Normal', className: styles.normal }
  }

  const getMovementIcon = (type: string) => {
    return MOVEMENT_TYPES.find(t => t.value === type)?.icon || '📋'
  }

  const getMovementLabel = (type: string) => {
    return MOVEMENT_TYPES.find(t => t.value === type)?.label || type
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Gestión de Inventario</h1>
        </div>

        {/* Estadísticas */}
        {stats && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📦</div>
              <div className={styles.statInfo}>
                <h3>{stats.totalProducts}</h3>
                <p>Total Productos</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📊</div>
              <div className={styles.statInfo}>
                <h3>{stats.totalStock}</h3>
                <p>Unidades en Stock</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⚠️</div>
              <div className={styles.statInfo}>
                <h3>{stats.lowStockCount}</h3>
                <p>Stock Bajo</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>❌</div>
              <div className={styles.statInfo}>
                <h3>{stats.outOfStockCount}</h3>
                <p>Sin Stock</p>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.categorySelect}
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filterLowStock}
              onChange={(e) => setFilterLowStock(e.target.checked)}
            />
            Solo bajo stock
          </label>
        </div>

        {/* Tabla de productos */}
        {loading ? (
          <div className={styles.loading}>Cargando inventario...</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock Actual</th>
                  <th>Estado</th>
                  <th>Movimientos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product.stock)
                  return (
                    <tr key={product.id}>
                      <td>
                        <div className={styles.productInfo}>
                          {product.images[0] && (
                            <img src={product.images[0]} alt={product.name} />
                          )}
                          <span>{product.name}</span>
                        </div>
                      </td>
                      <td>{product.category.name}</td>
                      <td className={styles.stockCell}>
                        <strong>{product.stock}</strong> unidades
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td>{product._count?.inventoryMovements || 0}</td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            onClick={() => handleAdjust(product)}
                            className={styles.adjustBtn}
                            title="Ajustar inventario"
                          >
                            ⚙️
                          </button>
                          <button
                            onClick={() => handleViewHistory(product)}
                            className={styles.historyBtn}
                            title="Ver historial"
                          >
                            📋
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className={styles.emptyState}>
                No se encontraron productos
              </div>
            )}
          </div>
        )}

        {/* Modal de Ajuste */}
        {showModal && selectedProduct && (
          <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Ajustar Inventario</h2>
                <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                  ✕
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.productSummary}>
                  {selectedProduct.images[0] && (
                    <img src={selectedProduct.images[0]} alt={selectedProduct.name} />
                  )}
                  <div>
                    <h3>{selectedProduct.name}</h3>
                    <p>Stock actual: <strong>{selectedProduct.stock}</strong> unidades</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label>Tipo de Movimiento *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                    >
                      {MOVEMENT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Cantidad *</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="Ejemplo: 10"
                      required
                    />
                    <small>
                      {['PURCHASE', 'RETURN', 'ADJUSTMENT'].includes(formData.type)
                        ? '✅ Se agregará al stock'
                        : ['SALE', 'DAMAGE', 'LOSS'].includes(formData.type)
                        ? '⚠️ Se restará del stock'
                        : '🔄 Se establecerá como nuevo stock'}
                    </small>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Motivo</label>
                    <input
                      type="text"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Ej: Llegó mercancía del proveedor"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Notas adicionales</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      placeholder="Información adicional (opcional)"
                    />
                  </div>

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
                      className={styles.submitBtn}
                      disabled={saving}
                    >
                      {saving ? 'Guardando...' : 'Guardar Ajuste'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Historial */}
        {showHistoryModal && selectedProduct && (
          <div className={styles.modalOverlay} onClick={() => setShowHistoryModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Historial de Movimientos</h2>
                <button className={styles.closeBtn} onClick={() => setShowHistoryModal(false)}>
                  ✕
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.productSummary}>
                  {selectedProduct.images[0] && (
                    <img src={selectedProduct.images[0]} alt={selectedProduct.name} />
                  )}
                  <div>
                    <h3>{selectedProduct.name}</h3>
                    <p>{movements.length} movimientos registrados</p>
                  </div>
                </div>

                <div className={styles.movementsList}>
                  {movements.length === 0 ? (
                    <div className={styles.emptyState}>
                      No hay movimientos registrados
                    </div>
                  ) : (
                    movements.map((movement) => (
                      <div key={movement.id} className={styles.movementItem}>
                        <div className={styles.movementIcon}>
                          {getMovementIcon(movement.type)}
                        </div>
                        <div className={styles.movementInfo}>
                          <div className={styles.movementHeader}>
                            <strong>{getMovementLabel(movement.type)}</strong>
                            <span className={styles.movementDate}>
                              {new Date(movement.createdAt).toLocaleString('es-ES')}
                            </span>
                          </div>
                          <div className={styles.movementDetails}>
                            <span className={movement.quantity > 0 ? styles.positive : styles.negative}>
                              {movement.quantity > 0 ? '+' : ''}{movement.quantity} unidades
                            </span>
                            <span>Stock: {movement.previousStock} → {movement.newStock}</span>
                          </div>
                          {movement.reason && (
                            <div className={styles.movementReason}>
                              Motivo: {movement.reason}
                            </div>
                          )}
                          {movement.notes && (
                            <div className={styles.movementNotes}>
                              {movement.notes}
                            </div>
                          )}
                          {movement.performedBy && (
                            <div className={styles.movementPerformer}>
                              Por: {movement.performedBy}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
