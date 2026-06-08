export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  merchant: string;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  date: Date;
  time: string;
  day: string;   // Label del grupo: "Hoy", "Ayer", "4 jun", etc.
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  method: string;
  fee: number;
}
