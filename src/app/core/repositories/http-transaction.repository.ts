import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { environment } from '../../../environments/environment';
import type { TransactionRepository } from './transaction.repository';
import { TransactionDto, toTransaction } from './transaction.adapter';

/**
 * Implementación REST (Strategy): consume `{apiBaseUrl}/transactions` con
 * HttpClient y mapea el DTO al modelo de dominio con el Adapter. El token Bearer
 * lo añade `authInterceptor` de forma transparente. En el navegador sin backend,
 * MSW (`src/mocks`) intercepta estas peticiones.
 */
export class HttpTransactionRepository implements TransactionRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/transactions`;

  getAll(): Observable<Transaction[]> {
    return this.http
      .get<TransactionDto[]>(this.baseUrl)
      .pipe(map(dtos => dtos.map(toTransaction)));
  }

  getById(id: string): Observable<Transaction | undefined> {
    return this.http
      .get<TransactionDto>(`${this.baseUrl}/${id}`)
      .pipe(map(toTransaction));
  }
}
