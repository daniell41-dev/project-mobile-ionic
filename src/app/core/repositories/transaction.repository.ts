import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { environment } from '../../../environments/environment';
import { InMemoryTransactionRepository } from './in-memory-transaction.repository';
import { HttpTransactionRepository } from './http-transaction.repository';

/**
 * Repositorio de movimientos (patrón Repository / GoF).
 *
 * Contrato de acceso a datos independiente de la fuente. Se modela como
 * interfaz + `InjectionToken` (en vez de clase abstracta) para evitar el ciclo
 * de imports con las implementaciones, que solo dependen del tipo (`import type`).
 *
 * Implementaciones intercambiables (Strategy):
 *  - `InMemoryTransactionRepository`: datos semilla (offline, demo robusta).
 *  - `HttpTransactionRepository`: REST real vía HttpClient (interceptado por
 *    MSW en el navegador cuando no hay backend).
 *
 * La selección se hace por `environment.useMockApi`. El token usa
 * `providedIn: 'root'` + `factory`, de modo que la app y los tests resuelven la
 * misma implementación por defecto sin configuración extra.
 */
export interface TransactionRepository {
  getAll(): Observable<Transaction[]>;
  getById(id: string): Observable<Transaction | undefined>;
}

export function transactionRepositoryFactory(): TransactionRepository {
  return environment.useMockApi
    ? new InMemoryTransactionRepository()
    : new HttpTransactionRepository();
}

export const TRANSACTION_REPOSITORY = new InjectionToken<TransactionRepository>(
  'TransactionRepository',
  { providedIn: 'root', factory: transactionRepositoryFactory },
);
