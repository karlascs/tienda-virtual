'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './CheckoutSuccess.module.css';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const authCode = searchParams.get('authCode');

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.successIcon}>✅</div>
        <h1 className={styles.title}>¡Pago Exitoso!</h1>
        
        <div className={styles.message}>
          <p>Tu compra ha sido procesada correctamente.</p>
          <p>Recibirás un correo con los detalles de tu pedido.</p>
        </div>

        {orderId && (
          <div className={styles.orderInfo}>
            <h2>Detalles del Pedido</h2>
            <div className={styles.details}>
              <div className={styles.detailRow}>
                <span className={styles.label}>Número de Orden:</span>
                <span className={styles.value}>#{orderId}</span>
              </div>
              {amount && (
                <div className={styles.detailRow}>
                  <span className={styles.label}>Monto Total:</span>
                  <span className={styles.value}>${parseInt(amount).toLocaleString('es-CL')}</span>
                </div>
              )}
              {authCode && (
                <div className={styles.detailRow}>
                  <span className={styles.label}>Código de Autorización:</span>
                  <span className={styles.value}>{authCode}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.infoBox}>
          <h3>¿Qué sigue?</h3>
          <ul>
            <li>📧 Recibirás un correo de confirmación</li>
            <li>📦 Prepararemos tu pedido para envío</li>
            <li>🚚 Te notificaremos cuando sea despachado</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Link href={orderId ? `/orders/${orderId}` : '/orders'} className={styles.button}>
            Ver Mi Pedido
          </Link>
          <Link href="/" className={styles.buttonSecondary}>
            Volver a la Tienda
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Cargando...</h1>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
