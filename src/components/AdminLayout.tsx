/**
 * Layout del panel de administración
 */
'use client'

import { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import styles from './AdminLayout.module.css'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false) // Cerrado por defecto en móviles
  const [isMobile, setIsMobile] = useState(false)

  // Función para cerrar sesión
  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Volver a la tienda
          </Link>
          
          <button 
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar Sesión
          </button>
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
