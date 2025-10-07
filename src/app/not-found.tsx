'use client';

import Link from 'next/link';

/**
 * Página 404 - No Encontrado
 * 
 * Página personalizada que se muestra cuando una ruta no existe.
 * Diseño elegante que mantiene la coherencia visual con el resto del sitio.
 */
export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1>Página no encontrada</h1>
          <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
          <div className="not-found-actions">
            <Link href="/" className="btn-primary">
              Volver al inicio
            </Link>
            <Link href="/products/hogar" className="btn-secondary">
              Ver productos
            </Link>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .not-found-container {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        
        .not-found-content {
          text-align: center;
          max-width: 600px;
          padding: 3rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .error-code {
          font-size: 8rem;
          font-weight: 900;
          color: #2d4a4a;
          line-height: 1;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #2d4a4a 0%, #4a6741 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d4a4a;
          margin-bottom: 1rem;
        }
        
        p {
          font-size: 1.1rem;
          color: #6c757d;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }
        
        .not-found-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-block;
        }
        
        .btn-primary {
          background: #2d4a4a;
          color: white;
        }
        
        .btn-primary:hover {
          background: #1a2f2f;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(45, 74, 74, 0.3);
        }
        
        .btn-secondary {
          background: transparent;
          color: #2d4a4a;
          border: 2px solid #2d4a4a;
        }
        
        .btn-secondary:hover {
          background: #2d4a4a;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(45, 74, 74, 0.3);
        }
        
        @media (max-width: 768px) {
          .not-found-content {
            padding: 2rem;
            margin: 1rem;
          }
          
          .error-code {
            font-size: 6rem;
          }
          
          h1 {
            font-size: 2rem;
          }
          
          .not-found-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .btn-primary, .btn-secondary {
            width: 100%;
            max-width: 200px;
          }
        }
      `}</style>
    </div>
  );
}