/**
 * Componente para mostrar opciones de envío de Chilexpress
 */
'use client';

import { useState, useEffect } from 'react';
import styles from './ShippingOptions.module.css';

interface ShippingOption {
  service: string;
  code: string;
  price: number;
  estimatedDays: number;
  carrier: string;
}

interface ShippingOptionsProps {
  commune: string;
  city: string;
  region: string;
  cartTotal: number;
  cartItems?: any[];
  onShippingSelected: (price: number, option: ShippingOption) => void;
}

export default function ShippingOptions({
  commune,
  city,
  region,
  cartTotal,
  cartItems,
  onShippingSelected
}: ShippingOptionsProps) {
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (region && city) {
      fetchShippingOptions();
    }
  }, [region, city, cartTotal]);

  const fetchShippingOptions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/shipping/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commune: city,
          city,
          region,
          items: cartItems?.map(item => ({
            weight: item.weight || 0.5, // 500g por defecto
            quantity: item.quantity || 1
          })) || [],
          totalValue: cartTotal
        })
      });

      if (!response.ok) {
        throw new Error('Error al obtener opciones de envío');
      }

      const data = await response.json();

      if (data.success && data.quotes && data.quotes.length > 0) {
        setOptions(data.quotes);
        // Seleccionar automáticamente la opción más económica
        const cheapestOption = data.quotes.reduce((prev: ShippingOption, curr: ShippingOption) =>
          prev.price < curr.price ? prev : curr
        );
        setSelectedOption(cheapestOption);
        onShippingSelected(cheapestOption.price, cheapestOption);
      } else {
        throw new Error('No hay opciones de envío disponibles');
      }
    } catch (err) {
      console.error('Error fetching shipping:', err);
      setError('No se pudo cargar opciones de envío. Usando tarifa estándar.');
      
      // Fallback: opción por defecto
      const fallbackOption: ShippingOption = {
        service: 'Envío Nacional',
        code: 'STANDARD',
        price: 3000,
        estimatedDays: 3,
        carrier: 'Envío Nacional'
      };
      setOptions([fallbackOption]);
      setSelectedOption(fallbackOption);
      onShippingSelected(fallbackOption.price, fallbackOption);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option: ShippingOption) => {
    setSelectedOption(option);
    onShippingSelected(option.price, option);
  };

  if (!region || !city) {
    return (
      <div className={styles.notice}>
        <span>📍</span>
        <span>Ingresa tu región y comuna para ver opciones de envío</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner}></span>
        <span>Cotizando opciones de envío...</span>
      </div>
    );
  }

  if (error && options.length === 0) {
    return (
      <div className={styles.error}>
        <span>⚠️</span>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>🚚 Opciones de Envío</h3>
      
      {error && (
        <div className={styles.warning}>
          <span>ℹ️</span>
          <span>{error}</span>
        </div>
      )}

      <div className={styles.options}>
        {options.map((option, index) => (
          <div
            key={index}
            className={`${styles.option} ${
              selectedOption?.code === option.code ? styles.selected : ''
            }`}
            onClick={() => handleSelectOption(option)}
          >
            <input
              type="radio"
              name="shipping"
              checked={selectedOption?.code === option.code}
              onChange={() => handleSelectOption(option)}
              className={styles.radio}
            />
            
            <div className={styles.optionContent}>
              <div className={styles.optionHeader}>
                <span className={styles.serviceName}>{option.service}</span>
                <span className={styles.price}>${option.price.toLocaleString('es-CL')}</span>
              </div>
              
              <div className={styles.optionDetails}>
                <span className={styles.carrier}>{option.carrier}</span>
                <span className={styles.deliveryTime}>
                  {option.estimatedDays === 1 
                    ? 'Entrega mañana' 
                    : `Entrega en ${option.estimatedDays} días`
                  }
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedOption && (
        <div className={styles.summary}>
          <span>Costo de envío seleccionado:</span>
          <span className={styles.summaryPrice}>
            ${selectedOption.price.toLocaleString('es-CL')}
          </span>
        </div>
      )}
    </div>
  );
}
