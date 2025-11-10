/**
 * Página de gestión de órdenes para admin
 */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import styles from './OrdersManagement.module.css'

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  items: Array<{
    quantity: number
    price: number
    product: {
      name: string
      images: string[]
    }
  }>
  user: {
    name: string | null
    email: string
  }
}

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    loadOrders()
  }, [statusFilter])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const url = statusFilter === 'all'
        ? '/api/admin/orders'
        : `/api/admin/orders?status=${statusFilter}`

      const res = await fetch(url)
      const data = await res.json()

      if (data.success) {
        setOrders(data.data)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        alert('Estado actualizado')
        loadOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Error al actualizar estado')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: styles.pending,
      PROCESSING: styles.processing,
      SHIPPED: styles.shipped,
      DELIVERED: styles.delivered,
      CANCELLED: styles.cancelled
    }
    return colors[status] || ''
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pendiente',
      PROCESSING: 'Procesando',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregado',
      CANCELLED: 'Cancelado'
    }
    return labels[status] || status
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Gestión de Órdenes</h1>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.statusFilter}
          >
            <option value="all">Todos los estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="PROCESSING">En proceso</option>
            <option value="SHIPPED">Enviados</option>
            <option value="DELIVERED">Entregados</option>
            <option value="CANCELLED">Cancelados</option>
          </select>
        </div>

        {loading ? (
          <div className={styles.loading}>Cargando órdenes...</div>
        ) : (
          <div className={styles.ordersContainer}>
            <div className={styles.ordersList}>
              {orders.length > 0 ? (
                orders.map(order => (
                  <div
                    key={order.id}
                    className={`${styles.orderCard} ${selectedOrder?.id === order.id ? styles.selected : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className={styles.orderHeader}>
                      <div>
                        <div className={styles.orderId}>#{order.id.slice(0, 8)}</div>
                        <div className={styles.orderDate}>
                          {new Date(order.createdAt).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <span className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className={styles.orderInfo}>
                      <div className={styles.customerInfo}>
                        <strong>{order.user.name || 'Cliente'}</strong>
                        <span>{order.user.email}</span>
                      </div>
                      <div className={styles.orderTotal}>
                        ${order.total.toFixed(2)}
                      </div>
                    </div>

                    <div className={styles.orderItems}>
                      {order.items.length} producto(s)
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  No se encontraron órdenes
                </div>
              )}
            </div>

            {/* Panel de detalles */}
            {selectedOrder && (
              <div className={styles.orderDetails}>
                <div className={styles.detailsHeader}>
                  <h2>Detalles de la Orden</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className={styles.closeDetailsBtn}
                  >
                    ✕
                  </button>
                </div>

                <div className={styles.detailsContent}>
                  <div className={styles.detailsSection}>
                    <h3>Información General</h3>
                    <p><strong>ID:</strong> {selectedOrder.id}</p>
                    <p><strong>Fecha:</strong> {new Date(selectedOrder.createdAt).toLocaleString('es-ES')}</p>
                    <p><strong>Cliente:</strong> {selectedOrder.user.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedOrder.user.email}</p>
                  </div>

                  <div className={styles.detailsSection}>
                    <h3>Estado</h3>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                      className={styles.statusSelect}
                    >
                      <option value="PENDING">Pendiente</option>
                      <option value="PROCESSING">Procesando</option>
                      <option value="SHIPPED">Enviado</option>
                      <option value="DELIVERED">Entregado</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </div>

                  <div className={styles.detailsSection}>
                    <h3>Productos</h3>
                    <div className={styles.productsList}>
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className={styles.productItem}>
                          {item.product.images[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className={styles.productImage}
                            />
                          )}
                          <div className={styles.productInfo}>
                            <div className={styles.productName}>{item.product.name}</div>
                            <div className={styles.productQuantity}>
                              Cantidad: {item.quantity}
                            </div>
                            <div className={styles.productPrice}>
                              ${item.price.toFixed(2)} c/u
                            </div>
                          </div>
                          <div className={styles.productTotal}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.detailsSection}>
                    <div className={styles.totalRow}>
                      <strong>Total:</strong>
                      <strong className={styles.totalAmount}>
                        ${selectedOrder.total.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
