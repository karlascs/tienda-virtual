/**
 * Cliente para API de Chilexpress
 * Documentación: https://developers.chilexpress.cl/
 */

interface ChilexpressConfig {
  apiKey: string;
  apiSecret: string;
  environment: 'sandbox' | 'production';
}

interface ChilexpressAddress {
  streetName: string;
  streetNumber: string;
  commune: string;
  city: string;
  region: string;
  postalCode?: string;
}

interface ChilexpressPackage {
  weight: number; // en kilogramos
  length: number; // en centímetros
  width: number;  // en centímetros
  height: number; // en centímetros
  declaredValue: number; // valor declarado en pesos
}

interface ChilexpressQuote {
  serviceDescription: string;
  serviceCode: string;
  price: number;
  estimatedDeliveryDays: number;
}

interface ChilexpressShipment {
  trackingNumber: string;
  label: string; // URL o base64 de la etiqueta
}

export class ChilexpressClient {
  private config: ChilexpressConfig;
  private baseUrl: string;

  constructor(config: ChilexpressConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'production'
      ? 'https://api.chilexpress.cl'
      : 'https://sandbox.chilexpress.cl';
  }

  /**
   * Obtener token de autenticación
   */
  private async getAuthToken(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: this.config.apiKey,
          apiSecret: this.config.apiSecret,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al autenticar con Chilexpress');
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Error en autenticación Chilexpress:', error);
      throw error;
    }
  }

  /**
   * Cotizar envío
   */
  async quoteShipping(
    origin: ChilexpressAddress,
    destination: ChilexpressAddress,
    packages: ChilexpressPackage[]
  ): Promise<ChilexpressQuote[]> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(`${this.baseUrl}/v1/rates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          origin,
          destination,
          packages,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al cotizar envío');
      }

      const data = await response.json();
      return data.quotes || [];
    } catch (error) {
      console.error('Error al cotizar envío:', error);
      throw error;
    }
  }

  /**
   * Crear envío
   */
  async createShipment(
    origin: ChilexpressAddress,
    destination: ChilexpressAddress,
    packages: ChilexpressPackage[],
    serviceCode: string,
    orderNumber: string
  ): Promise<ChilexpressShipment> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(`${this.baseUrl}/v1/shipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          origin,
          destination,
          packages,
          serviceCode,
          reference: orderNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear envío');
      }

      const data = await response.json();
      return {
        trackingNumber: data.trackingNumber,
        label: data.labelUrl,
      };
    } catch (error) {
      console.error('Error al crear envío:', error);
      throw error;
    }
  }

  /**
   * Rastrear envío
   */
  async trackShipment(trackingNumber: string): Promise<any> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(
        `${this.baseUrl}/v1/tracking/${trackingNumber}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al rastrear envío');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al rastrear envío:', error);
      throw error;
    }
  }

  /**
   * Obtener regiones y comunas
   */
  async getRegions(): Promise<any[]> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(`${this.baseUrl}/v1/coverage/regions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener regiones');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener regiones:', error);
      throw error;
    }
  }

  /**
   * Obtener comunas por región
   */
  async getCommunes(regionCode: string): Promise<any[]> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(
        `${this.baseUrl}/v1/coverage/regions/${regionCode}/communes`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener comunas');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener comunas:', error);
      throw error;
    }
  }
}

// Instancia singleton del cliente
export const chilexpress = new ChilexpressClient({
  apiKey: process.env.CHILEXPRESS_API_KEY || '',
  apiSecret: process.env.CHILEXPRESS_API_SECRET || '',
  environment: (process.env.CHILEXPRESS_ENV as 'sandbox' | 'production') || 'sandbox',
});

// Configuración por defecto
export const CHILEXPRESS_CONFIG = {
  defaultOrigin: {
    streetName: 'Simón Bolívar',
    streetNumber: '485',
    commune: 'Valparaíso',
    city: 'Valparaíso',
    region: 'Valparaíso',
    postalCode: '2390030',
  },
  defaultPackage: {
    weight: 1, // 1 kg por defecto
    length: 30,
    width: 30,
    height: 10,
  },
};
