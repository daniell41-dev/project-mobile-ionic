import {
  TransactionDto,
  toTransaction,
  toTransactionDto,
} from '../../src/app/core/repositories/transaction.adapter';

// Spec ejecutado con Jest sobre funciones puras del Adapter.
describe('transaction.adapter (Jest)', () => {
  const dto: TransactionDto = {
    id: 't1', type: 'income', amount: 100, merchant: 'X', category: 'Ingresos',
    categoryIcon: 'cash', categoryColor: '#000', date: '2026-06-01T08:00:00.000Z',
    time: '08:00', day: 'Hoy', status: 'completed', reference: 'R1', method: 'SPEI', fee: 0,
  };

  it('converts the ISO date string to a Date', () => {
    const tx = toTransaction(dto);
    expect(tx.date).toBeInstanceOf(Date);
    expect(tx.date.toISOString()).toBe('2026-06-01T08:00:00.000Z');
  });

  it('round-trips DTO → model → DTO', () => {
    expect(toTransactionDto(toTransaction(dto))).toEqual(dto);
  });
});
