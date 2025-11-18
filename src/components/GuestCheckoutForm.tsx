'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import styles from './GuestCheckoutForm.module.css';

interface GuestCheckoutFormProps {
  onDataComplete: (data: CheckoutData) => void;
}

export interface CheckoutData {
  // Datos personales
  name: string;
  email: string;
  phone: string;
  rut: string;
  
  // Dirección
  street: string;
  city: string;
  region: string;
  
  // Modo
  isGuest: boolean;
}

const REGIONES_CHILE = [
  'Región de Arica y Parinacota',
  'Región de Tarapacá',
  'Región de Antofagasta',
  'Región de Atacama',
  'Región de Coquimbo',
  'Región de Valparaíso',
  'Región Metropolitana',
  'Región del Libertador',
  'Región del Maule',
  'Región de Ñuble',
  'Región del Biobío',
  'Región de La Araucanía',
  'Región de Los Ríos',
  'Región de Los Lagos',
  'Región de Aysén',
  'Región de Magallanes'
];

export default function GuestCheckoutForm({ onDataComplete }: GuestCheckoutFormProps) {
  const { data: session } = useSession();
  const [isGuest, setIsGuest] = useState(true);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  
  const [formData, setFormData] = useState<CheckoutData>({
    name: '',
    email: '',
    phone: '',
    rut: '',
    street: '',
    city: '',
    region: '',
    isGuest: true
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutData, string>>>({});

  // Si hay sesión, pre-llenar datos
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
        isGuest: false
      }));
      setIsGuest(false);
    }
  }, [session]);

  // Validar RUT chileno
  const validateRUT = (rut: string): boolean => {
    // Limpiar RUT
    const cleanRUT = rut.replace(/[^0-9kK]/g, '');
    if (cleanRUT.length < 2) return false;

    const body = cleanRUT.slice(0, -1);
    const dv = cleanRUT.slice(-1).toLowerCase();

    // Calcular dígito verificador
    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expectedDV = 11 - (sum % 11);
    const finalDV = expectedDV === 11 ? '0' : expectedDV === 10 ? 'k' : expectedDV.toString();

    return dv === finalDV;
  };

  // Formatear RUT mientras se escribe
  const formatRUT = (value: string): string => {
    const cleaned = value.replace(/[^0-9kK]/g, '');
    if (cleaned.length <= 1) return cleaned;

    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);

    // Formatear con puntos
    const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formatted}-${dv}`;
  };

  // Validar email
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validar teléfono chileno
  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    // +56 9 XXXX XXXX (celular) o +56 2 XXXX XXXX (fijo)
    return cleaned.length >= 8 && cleaned.length <= 11;
  };

  // Manejar cambios en los campos
  const handleChange = (field: keyof CheckoutData, value: string) => {
    let processedValue = value;

    // Formatear RUT
    if (field === 'rut') {
      processedValue = formatRUT(value);
    }

    // Formatear teléfono
    if (field === 'phone') {
      processedValue = value.replace(/[^0-9+\s]/g, '');
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validar formulario completo
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Teléfono es requerido';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Teléfono inválido (ej: +56912345678)';
    }

    if (!formData.rut.trim()) {
      newErrors.rut = 'RUT es requerido';
    } else if (!validateRUT(formData.rut)) {
      newErrors.rut = 'RUT inválido';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Dirección es requerida';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Ciudad es requerida';
    }

    if (!formData.region) {
      newErrors.region = 'Región es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verificar si está completo y notificar al padre
  useEffect(() => {
    if (validateForm()) {
      onDataComplete(formData);
    }
  }, [formData]);

  // Inicializar Google Places Autocomplete
  const initAutocomplete = () => {
    if (typeof google === 'undefined' || !google.maps) return;

    const input = document.getElementById('street-input') as HTMLInputElement;
    if (!input) return;

    const options = {
      componentRestrictions: { country: 'cl' }, // Solo Chile
      fields: ['address_components', 'formatted_address', 'geometry'],
    };

    const autoCompleteInstance = new google.maps.places.Autocomplete(input, options);
    
    autoCompleteInstance.addListener('place_changed', () => {
      const place = autoCompleteInstance.getPlace();
      
      if (!place.address_components) return;

      let street = '';
      let city = '';
      let region = '';
      let postalCode = '';

      place.address_components.forEach((component: google.maps.GeocoderAddressComponent) => {
        const types = component.types;

        if (types.includes('route') || types.includes('street_address')) {
          street = component.long_name;
        }
        if (types.includes('street_number')) {
          street = `${component.long_name} ${street}`;
        }
        if (types.includes('locality') || types.includes('administrative_area_level_3')) {
          city = component.long_name;
        }
        if (types.includes('administrative_area_level_1')) {
          region = component.long_name;
        }
        if (types.includes('postal_code')) {
          postalCode = component.long_name;
        }
      });

      setFormData(prev => ({
        ...prev,
        street: street || place.formatted_address || '',
        city: city || prev.city,
        region: region || prev.region
      }));
    });

    setAutocomplete(autoCompleteInstance);
  };

  return (
    <>
      {/* Google Maps Script */}
      {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          onLoad={initAutocomplete}
        />
      )}

      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Información de Entrega</h3>
          {!session && (
            <div className={styles.guestToggle}>
              <label>
                <input
                  type="checkbox"
                  checked={isGuest}
                  onChange={(e) => {
                    setIsGuest(e.target.checked);
                    setFormData(prev => ({ ...prev, isGuest: e.target.checked }));
                  }}
                />
                Comprar como invitado
              </label>
            </div>
          )}
        </div>

        <div className={styles.form}>
          {/* Datos Personales */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Datos Personales
            </h4>
            
            <div className={styles.field}>
              <label htmlFor="name">Nombre Completo *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? styles.error : ''}
                placeholder="Juan Pérez"
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={errors.email ? styles.error : ''}
                  placeholder="juan@ejemplo.cl"
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="rut">RUT *</label>
                <input
                  id="rut"
                  type="text"
                  value={formData.rut}
                  onChange={(e) => handleChange('rut', e.target.value)}
                  className={errors.rut ? styles.error : ''}
                  placeholder="12.345.678-9"
                  maxLength={12}
                />
                {errors.rut && <span className={styles.errorText}>{errors.rut}</span>}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="phone">Teléfono *</label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={errors.phone ? styles.error : ''}
                placeholder="+56912345678"
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>
          </div>

          {/* Dirección con Google Maps */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Dirección de Entrega
            </h4>
            
            <div className={styles.field}>
              <label htmlFor="street-input">
                Calle y Número * 
                <span className={styles.hint}>Empieza a escribir para autocompletar</span>
              </label>
              <input
                id="street-input"
                type="text"
                value={formData.street}
                onChange={(e) => handleChange('street', e.target.value)}
                className={errors.street ? styles.error : ''}
                placeholder="Av. Libertador 1234, Depto 501"
              />
              {errors.street && <span className={styles.errorText}>{errors.street}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="city">Ciudad *</label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className={errors.city ? styles.error : ''}
                placeholder="Santiago"
              />
              {errors.city && <span className={styles.errorText}>{errors.city}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="region">Región *</label>
              <select
                id="region"
                value={formData.region}
                onChange={(e) => handleChange('region', e.target.value)}
                className={errors.region ? styles.error : ''}
              >
                <option value="">Selecciona una región</option>
                {REGIONES_CHILE.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              {errors.region && <span className={styles.errorText}>{errors.region}</span>}
            </div>
          </div>

          {/* Información adicional */}
          {isGuest && (
            <div className={styles.infoBox}>
              <p>
                💡 <strong>Compra rápida como invitado</strong><br />
                No necesitas crear una cuenta. Solo completa estos datos para recibir tu pedido.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
