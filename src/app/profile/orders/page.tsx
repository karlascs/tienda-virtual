/**
 * Página de Órdenes del Usuario - IZA&CAS
 */
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Orders.module.css'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    name: string
    images: string[]
  }
}

interface Order {
  id: string
  orderNumber: string
  total: number
  subtotal: number
  shipping: number
  status: string
  createdAt: string
  shippingAddress: string
  shippingCity: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status, router])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/user/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando órdenes...</div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    PENDING: '#FFA500',
    CONFIRMED: '#2196F3',
    PROCESSING: '#9C27B0',
    SHIPPED: '#FF9800',
    DELIVERED: '#4CAF50',
    CANCELLED: '#F44336',
  }

  const statusLabels: Record<string, string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmada',
    PROCESSING: 'En proceso',
    SHIPPED: 'Enviada',
    DELIVERED: 'Entregada',
    CANCELLED: 'Cancelada',
  }

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === filter)

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <Link href="/profile" className={styles.backLink}>
              ← Volver al perfil
            </Link>
            <h1 className={styles.title}>Mis Órdenes</h1>
          </div>
        </div>

        {/* Filtros */}
        <div className={styles.filters}>
          <button 
            className={filter === 'ALL' ? styles.filterActive : styles.filterBtn}
            onClick={() => setFilter('ALL')}
          >
            Todas ({orders.length})
          </button>
          <button 
            className={filter === 'PENDING' ? styles.filterActive : styles.filterBtn}
            onClick={() => setFilter('PENDING')}
          >
            Pendientes ({orders.filter(o => o.status === 'PENDING').length})
          </button>
          <button 
            className={filter === 'DELIVERED' ? styles.filterActive : styles.filterBtn}
            onClick={() => setFilter('DELIVERED')}
          >
            Entregadas ({orders.filter(o => o.status === 'DELIVERED').length})
          </button>
        </div>

        {/* Lista de órdenes */}
        {filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No tienes órdenes {filter !== 'ALL' ? 'con este estado' : 'aún'}</p>
            <Link href="/" className={styles.shopBtn}>
              Comenzar a comprar
            </Link>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {filteredOrders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <h3 className={styles.orderNumber}>Orden #{order.orderNumber}</h3>
                    <span className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <span 
                    className={styles.orderStatus}
                    style={{ backgroundColor: statusColors[order.status] }}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>

                <div className={styles.orderBody}>
                  {/* Items */}
                  <div className={styles.orderItems}>
                    {order.items.map((item) => (
                      <div key={item.id} className={styles.orderItem}>
                        <div className={styles.itemImage}>
                          {item.product.images && item.product.images.length > 0 ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              width={60}
                              height={60}
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className={styles.noImage}>Sin imagen</div>
                          )}
                        </div>
                        <div className={styles.itemInfo}>
                          <p className={styles.itemName}>{item.product.name}</p>
                          <p className={styles.itemDetails}>
                            Cantidad: {item.quantity} × ${item.price.toLocaleString('es-CL')}
                          </p>
                        </div>
                        <div className={styles.itemTotal}>
                          ${(item.quantity * item.price).toLocaleString('es-CL')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totales */}
                  <div className={styles.orderTotals}>
                    <div className={styles.totalRow}>
                      <span>Subtotal:</span>
                      <span>${order.subtotal.toLocaleString('es-CL')}</span>
                    </div>
                    <div className={styles.totalRow}>
                      <span>Envío:</span>
                      <span>${order.shipping.toLocaleString('es-CL')}</span>
                    </div>
                    <div className={`${styles.totalRow} ${styles.totalFinal}`}>
                      <span>Total:</span>
                      <span>${order.total.toLocaleString('es-CL')}</span>
                    </div>
                  </div>

                  {/* Dirección de envío */}
                  {order.shippingAddress && (
                    <div className={styles.shippingInfo}>
                      <strong>Dirección de envío:</strong>
                      <p>{order.shippingAddress}, {order.shippingCity}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
