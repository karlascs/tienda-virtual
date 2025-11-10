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
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.overview.totalProducts}</div>
              <div className={styles.statLabel}>Productos</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏷️</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.overview.totalCategories}</div>
              <div className={styles.statLabel}>Categorías</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🛒</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.overview.totalOrders}</div>
              <div className={styles.statLabel}>Órdenes</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>${stats.overview.totalRevenue.toFixed(2)}</div>
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
                      <div className={styles.orderTotal}>${order.total.toFixed(2)}</div>
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
