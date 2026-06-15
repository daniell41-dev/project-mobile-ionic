import { Transaction } from '../models/transaction.model';

/**
 * Datos semilla de movimientos (es-MX). Fuente de verdad de los mocks:
 * - `InMemoryTransactionRepository` los devuelve tal cual.
 * - Los handlers de MSW (`src/mocks`) los serializan como respuesta REST.
 *
 * Se calculan las fechas relativas a "hoy" para que la UI agrupe por día de
 * forma coherente (Hoy / Ayer / etc.).
 */
export const TRANSACTION_SEED: Transaction[] = [
  {
    id: 't1', type: 'income', amount: 18400,
    merchant: 'Nómina · ACME S.A.', category: 'Ingresos',
    categoryIcon: 'cash', categoryColor: '#3FD1A0',
    date: new Date(), time: '08:02', day: 'Hoy',
    status: 'completed', reference: 'NOM202406010001', method: 'SPEI', fee: 0,
  },
  {
    id: 't2', type: 'expense', amount: 199,
    merchant: 'Spotify Premium', category: 'Entretenimiento',
    categoryIcon: 'musical-notes', categoryColor: '#4C8DFF',
    date: new Date(), time: '07:41', day: 'Hoy',
    status: 'completed', reference: 'SPT202406010001', method: 'Cargo automático', fee: 0,
  },
  {
    id: 't3', type: 'expense', amount: 1250,
    merchant: 'Mercado Pago', category: 'Compras',
    categoryIcon: 'bag-handle', categoryColor: '#F5A623',
    date: new Date(Date.now() - 86400000), time: '15:30', day: 'Ayer',
    status: 'completed', reference: 'MP202405310001', method: 'Tarjeta débito', fee: 0,
  },
  {
    id: 't4', type: 'expense', amount: 340,
    merchant: 'Uber', category: 'Transporte',
    categoryIcon: 'car', categoryColor: '#9B59B6',
    date: new Date(Date.now() - 86400000), time: '09:15', day: 'Ayer',
    status: 'completed', reference: 'UBR202405310002', method: 'Cargo automático', fee: 0,
  },
  {
    id: 't5', type: 'expense', amount: 520,
    merchant: 'Costco', category: 'Supermercado',
    categoryIcon: 'storefront', categoryColor: '#E74C3C',
    date: new Date(Date.now() - 2 * 86400000), time: '12:00', day: '4 jun',
    status: 'completed', reference: 'CST202405300001', method: 'Tarjeta débito', fee: 0,
  },
  {
    id: 't6', type: 'income', amount: 2500,
    merchant: 'Transferencia recibida', category: 'Ingresos',
    categoryIcon: 'cash', categoryColor: '#3FD1A0',
    date: new Date(Date.now() - 2 * 86400000), time: '10:22', day: '4 jun',
    status: 'completed', reference: 'TRF202405300002', method: 'SPEI', fee: 0,
  },
];
