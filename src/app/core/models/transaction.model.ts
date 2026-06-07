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
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  method: string;
  fee: number;
}
