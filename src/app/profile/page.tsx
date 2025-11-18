/**
 * Panel de Perfil de Usuario - IZA&CAS
 * Dashboard principal para usuarios compradores
 */
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './Profile.module.css'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  rut?: string
  address?: string
  city?: string
  zipCode?: string
}

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  createdAt: string
  items: Array<{
    quantity: number
    product: { name: string }
  }>
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      // Redirigir a admin si es administrador
      if (session?.user?.role === 'ADMIN') {
        router.push('/admin')
        return
      }

      // Cargar datos del perfil
      fetchProfile()
      fetchOrders()
    }
  }, [status, session, router])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile(data.user)
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error)
    }
  }

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
        <div className={styles.loading}>Cargando perfil...</div>
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

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Mi Cuenta</h1>
        
        <div className={styles.grid}>
          {/* Panel de información del usuario */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <h2>Información Personal</h2>
              </div>
              <Link href="/profile/edit" className={styles.editBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Editar
              </Link>
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Nombre</span>
                <span className={styles.value}>{profile?.name || session?.user?.name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>{profile?.email || session?.user?.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Teléfono</span>
                <span className={styles.value}>{profile?.phone || 'No registrado'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Teléfono</span>
                <span className={styles.value}>{profile?.phone || 'No registrado'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>RUT</span>
                <span className={styles.value}>{profile?.rut || 'No registrado'}</span>
              </div>
            </div>
          </div>

          {/* Panel de dirección */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <h2>Dirección de Envío</h2>
              </div>
              <Link href="/profile/edit" className={styles.editBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                {profile?.address ? 'Editar' : 'Agregar'}
              </Link>
            </div>
            <div className={styles.profileInfo}>
              {profile?.address ? (
                <>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Dirección</span>
                    <span className={styles.value}>{profile.address}</span>
                  </div>
                  {profile.city && (
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Ciudad</span>
                      <span className={styles.value}>{profile.city}</span>
                    </div>
                  )}
                  {profile.zipCode && (
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Código Postal</span>
                      <span className={styles.value}>{profile.zipCode}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.emptyAddress}>
                  <p>No tienes una dirección registrada</p>
                  <Link href="/profile/edit" className={styles.addAddressBtn}>
                    + Agregar dirección
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Resumen de compras */}
        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{orders.length}</div>
                <div className={styles.statLabel}>Órdenes Totales</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {orders.filter(o => o.status === 'DELIVERED').length}
                </div>
                <div className={styles.statLabel}>Entregadas</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  ${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString('es-CL')}
                </div>
                <div className={styles.statLabel}>Total Gastado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Órdenes recientes */}
        <div className={styles.ordersSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
              <h2>Mis Órdenes Recientes</h2>
            </div>
            <Link href="/profile/orders" className={styles.viewAllBtn}>
              Ver todas
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <h3>No tienes órdenes aún</h3>
              <p>Comienza a explorar nuestros productos</p>
              <Link href="/" className={styles.shopBtn}>
                Ir a la tienda
              </Link>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <span className={styles.orderNumber}>#{order.orderNumber}</span>
                      <span className={styles.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString('es-CL')}
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
                    <div className={styles.orderItems}>
                      {order.items.slice(0, 2).map((item, idx) => (
                        <span key={idx}>
                          {item.quantity}x {item.product.name}
                          {idx < Math.min(order.items.length, 2) - 1 && ', '}
                        </span>
                      ))}
                      {order.items.length > 2 && (
                        <span> y {order.items.length - 2} más</span>
                      )}
                    </div>
                    <div className={styles.orderTotal}>
                      ${order.total.toLocaleString('es-CL')}
                    </div>
                  </div>
                  <Link href={`/profile/orders/${order.id}`} className={styles.orderLink}>
                    Ver detalles →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones rápidas */}
        <div className={styles.quickActions}>
          <h3 className={styles.quickActionsTitle}>Acciones Rápidas</h3>
          <div className={styles.actionsGrid}>
            <Link href="/profile/edit" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <span className={styles.actionLabel}>Editar Perfil</span>
            </Link>
            <Link href="/profile/orders" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
              </div>
              <span className={styles.actionLabel}>Mis Órdenes</span>
            </Link>
            <Link href="/wishlist" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <span className={styles.actionLabel}>Lista de Deseos</span>
            </Link>
            <Link href="/cart" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <span className={styles.actionLabel}>Mi Carrito</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
