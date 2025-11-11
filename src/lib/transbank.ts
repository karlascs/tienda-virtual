/**
 * Configuración de Transbank Webpay Plus
 * SDK oficial para integración de pagos en Chile
 */

import { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } from 'transbank-sdk';

// Configuración del ambiente
const environment = process.env.TRANSBANK_ENVIRONMENT === 'production' 
  ? Environment.Production 
  : Environment.Integration;

const commerceCode = process.env.TRANSBANK_COMMERCE_CODE || IntegrationCommerceCodes.WEBPAY_PLUS;
const apiKey = process.env.TRANSBANK_API_KEY || IntegrationApiKeys.WEBPAY;

// Crear instancia de Webpay Plus
const options = new Options(commerceCode, apiKey, environment);
export const webpay = new WebpayPlus.Transaction(options);

// URLs de retorno
export const TRANSBANK_CONFIG = {
  returnUrl: process.env.TRANSBANK_RETURN_URL || 'http://localhost:3000/checkout/return',
  finalUrl: process.env.TRANSBANK_FINAL_URL || 'http://localhost:3000/checkout/success',
  environment: environment,
  isProduction: process.env.TRANSBANK_ENVIRONMENT === 'production',
};

/**
 * Tipos de respuesta de Transbank
 */
export interface TransbankTransaction {
  token: string;
  url: string;
}

export interface TransbankCommitResponse {
  vci: string;
  amount: number;
  status: string;
  buy_order: string;
  session_id: string;
  card_detail: {
    card_number: string;
  };
  accounting_date: string;
  transaction_date: string;
  authorization_code: string;
  payment_type_code: string;
  response_code: number;
  installments_number: number;
}

/**
 * Códigos de estado de Transbank
 */
export const TransbankStatus = {
  AUTHORIZED: 'AUTHORIZED',
  FAILED: 'FAILED',
  NULLIFIED: 'NULLIFIED',
  PARTIALLY_NULLIFIED: 'PARTIALLY_NULLIFIED',
  CAPTURED: 'CAPTURED',
};

/**
 * Códigos de respuesta VCI (Verificación de Comercio Internet)
 */
export const VCICodes = {
  TSY: 'Autenticación exitosa',
  TSN: 'Autenticación fallida',
  'TO ': 'Tiempo de autenticación excedido',
  ABO: 'Autenticación abortada',
  U3: 'Error en autenticación',
  INV: 'Tarjeta inválida',
};

/**
 * Tipos de pago
 */
export const PaymentTypes = {
  VD: 'Venta Débito',
  VN: 'Venta Normal',
  VC: 'Venta en cuotas',
  SI: 'Sin interés',
  S2: 'Sin interés 2 cuotas',
  NC: 'N cuotas sin interés',
  VP: 'Venta Prepago',
};
