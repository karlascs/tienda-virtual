/**
 * Layout del panel de administración
 */
'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './AdminLayout.module.css'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Productos', icon: '📦' },
    { href: '/admin/categories', label: 'Categorías', icon: '🏷️' },
    { href: '/admin/banners', label: 'Banners', icon: '🎨' },
    { href: '/admin/inventory', label: 'Inventario', icon: '📋' },
    { href: '/admin/sales', label: 'Ventas', icon: '💰' },
    { href: '/admin/sales/stats', label: 'Estadísticas', icon: '📈' },
    { href: '/admin/orders', label: 'Órdenes', icon: '🛒' }
  ]

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.closed : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>IZA&CAS Admin</h2>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={styles.toggleBtn}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>
        
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.backToStore}>
            ← Volver a la tienda
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  )
}
