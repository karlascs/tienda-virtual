/**
 * Layout del panel de administración
 */
'use client'

import { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './AdminLayout.module.css'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false) // Cerrado por defecto en móviles
  const [isMobile, setIsMobile] = useState(false)

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (!mobile) {
        setSidebarOpen(true) // Abierto en desktop
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Cerrar sidebar al navegar en móviles
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

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

  const utilityItems = [
    { href: '/', label: 'Volver a la Tienda', icon: '🏠', external: true }
  ]

  return (
    <div className={styles.container}>
      {/* Botón hamburguesa para móviles */}
      {isMobile && (
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={styles.toggleBtn}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Overlay para cerrar sidebar en móviles */}
      {isMobile && sidebarOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.closed : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>IZA&CAS Admin</h2>
        </div>
        
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link 
            href="/" 
            className={styles.backToStore}
            onClick={() => isMobile && setSidebarOpen(false)}
          >
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
