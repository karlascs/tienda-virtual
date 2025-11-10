'use client';

import { useSession } from 'next-auth/react';

export default function TestSession() {
  const { data: session, status } = useSession();

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>🔍 Test de Sesión</h1>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Estado: {status}</h2>
        
        {status === 'loading' && <p>⏳ Cargando...</p>}
        
        {status === 'unauthenticated' && (
          <div>
            <p>❌ No hay sesión activa</p>
            <a href="/login">Ir a login</a>
          </div>
        )}
        
        {status === 'authenticated' && session && (
          <div>
            <p>✅ Sesión activa</p>
            <pre style={{ 
              background: '#f4f4f4', 
              padding: '1rem', 
              borderRadius: '8px',
              overflow: 'auto' 
            }}>
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <a href="/">← Volver a inicio</a>
      </div>
    </div>
  );
}
