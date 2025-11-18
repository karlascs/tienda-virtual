/**
 * Página principal del dashboard de administración
 */
'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import styles from './AdminDashboard.module.css'

interface DashboardStats {
  overview: {
    totalProducts: number
    totalCategories: number
    totalOrders: number
    totalRevenue: number
  }
  recentOrders: Array<{
    id: string
    total: number
    status: string
    createdAt: string
    items: Array<{
      quantity: number
      product: { name: string }
    }>
  }>
  lowStockProducts: Array<{
    id: string
    name: string
    stock: number
    category: { name: string }
  }>
  topProducts: Array<{
    productId: string
    name: string
    salesCount: number
  }>
}

// Función para formatear a pesos chilenos
const formatCLP = (amount: number): string => {
  return `$${Math.round(amount).toLocaleString('es-CL')} CLP`
}

// Iconos SVG profesionales (mismo estilo que ProductModal)
const ProductsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)

const CategoriesIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)

const OrdersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1"/>
    <circle cx="19" cy="21" r="1"/>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
  </svg>
)

const RevenueIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
)

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Cargando dashboard...</div>
      </AdminLayout>
    )
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className={styles.error}>Error al cargar estadísticas</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className={styles.dashboard}>
        <h1 className={styles.title}>Dashboard</h1>

        {/* Resumen general */}
        <div className={styles.statsGrid}>
          <div key="products" className={styles.statCard}>
            <div className={styles.statIcon}>
              <ProductsIcon />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.overview.totalProducts}</div>
              <div className={styles.statLabel}>Productos</div>
            </div>
          </div>

          <div key="categories" className={styles.statCard}>
            <div className={styles.statIcon}>
              <CategoriesIcon />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.overview.totalCategories}</div>
              <div className={styles.statLabel}>Categorías</div>
            </div>
          </div>

          <div key="orders" className={styles.statCard}>
            <div className={styles.statIcon}>
              <OrdersIcon />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.overview.totalOrders}</div>
              <div className={styles.statLabel}>Órdenes</div>
            </div>
          </div>

          <div key="revenue" className={styles.statCard}>
            <div className={styles.statIcon}>
              <RevenueIcon />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{formatCLP(stats.overview.totalRevenue)}</div>
              <div className={styles.statLabel}>Ingresos Totales</div>
            </div>
          </div>
        </div>

        {/* Dos columnas */}
        <div className={styles.contentGrid}>
          {/* Órdenes recientes */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Órdenes Recientes</h2>
            <div className={styles.ordersList}>
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map(order => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <span className={styles.orderId}>#{order.id.slice(0, 8)}</span>
                      <span className={`${styles.orderStatus} ${styles[order.status.toLowerCase()]}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className={styles.orderDetails}>
                      <div>{order.items.length} producto(s)</div>
                      <div className={styles.orderTotal}>{formatCLP(order.total)}</div>
                    </div>
                    <div className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.emptyState}>No hay órdenes recientes</p>
              )}
            </div>
          </div>

          {/* Productos con bajo stock */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Alerta de Stock Bajo</h2>
            <div className={styles.stockList}>
              {stats.lowStockProducts.length > 0 ? (
                stats.lowStockProducts.map(product => (
                  <div key={product.id} className={styles.stockCard}>
                    <div className={styles.stockInfo}>
                      <div className={styles.stockName}>{product.name}</div>
                      <div className={styles.stockCategory}>{product.category.name}</div>
                    </div>
                    <div className={`${styles.stockBadge} ${product.stock === 0 ? styles.outOfStock : ''}`}>
                      {product.stock} unidades
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.emptyState}>Todos los productos tienen stock suficiente</p>
              )}
            </div>
          </div>
        </div>

        {/* Productos más vendidos */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Top 5 Productos Más Vendidos</h2>
          <div className={styles.topProductsList}>
            {stats.topProducts.length > 0 ? (
              stats.topProducts.map((product, index) => (
                <div key={product.productId} className={styles.topProductCard}>
                  <div className={styles.topProductRank}>#{index + 1}</div>
                  <div className={styles.topProductInfo}>
                    <div className={styles.topProductName}>{product.name}</div>
                    <div className={styles.topProductSales}>{product.salesCount} ventas</div>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>No hay datos de ventas</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
