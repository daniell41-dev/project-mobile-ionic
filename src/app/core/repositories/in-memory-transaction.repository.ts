import { Observable, of } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import type { TransactionRepository } from './transaction.repository';
import { TRANSACTION_SEED } from './transaction.seed';

/**
 * Implementación en memoria (Strategy): sirve los datos semilla sin red.
 * Es la opción por defecto para una PWA de portafolio robusta y offline.
 * Emite de forma síncrona con `of()`.
 */
export class InMemoryTransactionRepository implements TransactionRepository {
  getAll(): Observable<Transaction[]> {
    return of([...TRANSACTION_SEED]);
  }

  getById(id: string): Observable<Transaction | undefined> {
    return of(TRANSACTION_SEED.find(t => t.id === id));
  }
}
