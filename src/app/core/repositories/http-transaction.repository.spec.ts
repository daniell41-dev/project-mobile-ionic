import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

import { HttpTransactionRepository } from './http-transaction.repository';
import { TransactionDto } from './transaction.adapter';
import { environment } from '../../../environments/environment';

describe('HttpTransactionRepository', () => {
  let repo: HttpTransactionRepository;
  let httpMock: HttpTestingController;
  const base = `${environment.apiBaseUrl}/transactions`;

  const dto: TransactionDto = {
    id: 't1', type: 'income', amount: 100, merchant: 'X', category: 'Ingresos',
    categoryIcon: 'cash', categoryColor: '#000', date: '2026-06-01T08:00:00.000Z',
    time: '08:00', day: 'Hoy', status: 'completed', reference: 'R1', method: 'SPEI', fee: 0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    // Se instancia dentro del contexto de inyección de TestBed para que el
    // inject(HttpClient) del repo resuelva el cliente de pruebas.
    repo = TestBed.runInInjectionContext(() => new HttpTransactionRepository());
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getAll requests the transactions endpoint and adapts DTOs to models', async () => {
    const promise = firstValueFrom(repo.getAll());

    const req = httpMock.expectOne(base);
    expect(req.request.method).toBe('GET');
    req.flush([dto]);

    const list = await promise;
    expect(list.length).toBe(1);
    expect(list[0].date instanceof Date).toBeTrue();
    expect(list[0].id).toBe('t1');
  });

  it('getById requests the item endpoint and adapts the DTO', async () => {
    const promise = firstValueFrom(repo.getById('t1'));

    const req = httpMock.expectOne(`${base}/t1`);
    expect(req.request.method).toBe('GET');
    req.flush(dto);

    const tx = await promise;
    expect(tx?.date instanceof Date).toBeTrue();
    expect(tx?.merchant).toBe('X');
  });
});
