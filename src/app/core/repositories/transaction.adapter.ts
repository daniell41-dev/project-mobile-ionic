import { Transaction, TransactionType } from '../models/transaction.model';

/**
 * DTO tal como llega del backend REST (JSON): la fecha es un string ISO, no un
 * objeto Date. El Adapter aísla el formato de transporte del modelo de dominio.
 */
export interface TransactionDto {
  id: string;
  type: TransactionType;
  amount: number;
  merchant: string;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  date: string;
  time: string;
  day: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  method: string;
  fee: number;
}

/** Adapter (GoF): convierte el DTO de la API al modelo de dominio `Transaction`. */
export function toTransaction(dto: TransactionDto): Transaction {
  return { ...dto, date: new Date(dto.date) };
}

/** Serializa el modelo a DTO (útil para los handlers de MSW). */
export function toTransactionDto(tx: Transaction): TransactionDto {
  return { ...tx, date: tx.date.toISOString() };
}
