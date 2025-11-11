'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function SessionDebug() {
  const { data: session, status } = useSession();

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: status === 'authenticated' ? '#10b981' : '#ef4444',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: 9999
    }}>
      {status === 'loading' && '⏳ Cargando sesión...'}
      {status === 'authenticated' && (
        <>
          ✅ Sesión activa: {session.user?.name}
        </>
      )}
      {status === 'unauthenticated' && (
        <>
          ❌ No autenticado | <Link href="/login" style={{ color: 'white', textDecoration: 'underline' }}>Iniciar sesión</Link>
        </>
      )}
    </div>
  );
}
