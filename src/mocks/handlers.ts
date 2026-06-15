import { http, HttpResponse } from 'msw';
import { environment } from '../environments/environment';
import { TRANSACTION_SEED } from '../app/core/repositories/transaction.seed';
import { toTransactionDto } from '../app/core/repositories/transaction.adapter';

/**
 * Handlers de MSW: simulan el backend REST en el navegador para que la capa
 * HttpClient funcione sin servidor externo. Devuelven los datos semilla
 * serializados como DTO (fechas en ISO string).
 */
const base = `${environment.apiBaseUrl}/transactions`;

export const handlers = [
  http.get(base, () => {
    return HttpResponse.json(TRANSACTION_SEED.map(toTransactionDto));
  }),

  http.get(`${base}/:id`, ({ params }) => {
    const tx = TRANSACTION_SEED.find(t => t.id === params['id']);
    if (!tx) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(toTransactionDto(tx));
  }),
];
