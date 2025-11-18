'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './Edit.module.css';

interface UserData {
  name: string;
  email: string;
  phone: string;
  rut: string;
  address: string;
  city: string;
  zipCode: string;
}

export default function EditProfile() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    rut: '',
    address: '',
    city: '',
    zipCode: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          rut: data.rut || '',
          address: data.address || '',
          city: data.city || '',
          zipCode: data.zipCode || ''
        });
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos del perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/profile');
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      setError('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Cargando información...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <button 
            onClick={() => router.back()}
            className={styles.backBtn}
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Volver
          </button>
          <h1 className={styles.title}>Editar Perfil</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.alert + ' ' + styles.error}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.alert + ' ' + styles.success}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Perfil actualizado correctamente
            </div>
          )}

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Información Personal
            </h2>

            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Nombre Completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                required
                placeholder="Tu nombre completo"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                className={styles.input + ' ' + styles.disabled}
                disabled
              />
              <span className={styles.helper}>El email no se puede cambiar</span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
                placeholder="+56 9 1234 5678"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="rut" className={styles.label}>
                RUT
              </label>
              <input
                type="text"
                id="rut"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                className={styles.input}
                placeholder="12.345.678-9"
                maxLength={12}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Dirección de Envío
            </h2>

            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>
                Dirección Completa
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={styles.input}
                placeholder="Calle, número, depto/casa"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city" className={styles.label}>
                  Ciudad
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Santiago, Valparaíso, etc."
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="zipCode" className={styles.label}>
                  Código Postal
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="8320000"
                />
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.cancelBtn}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className={styles.spinner + ' ' + styles.small}></div>
                  Guardando...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
