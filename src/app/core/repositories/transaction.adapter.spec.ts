import { TransactionDto, toTransaction, toTransactionDto } from './transaction.adapter';

describe('transaction.adapter', () => {
  const dto: TransactionDto = {
    id: 't1', type: 'income', amount: 100, merchant: 'X', category: 'Ingresos',
    categoryIcon: 'cash', categoryColor: '#000', date: '2026-06-01T08:00:00.000Z',
    time: '08:00', day: 'Hoy', status: 'completed', reference: 'R1', method: 'SPEI', fee: 0,
  };

  it('toTransaction converts the ISO date string to a Date', () => {
    const tx = toTransaction(dto);
    expect(tx.date instanceof Date).toBeTrue();
    expect(tx.date.toISOString()).toBe('2026-06-01T08:00:00.000Z');
    expect(tx.id).toBe('t1');
    expect(tx.amount).toBe(100);
  });

  it('toTransactionDto serializes the Date back to an ISO string', () => {
    const tx = toTransaction(dto);
    const back = toTransactionDto(tx);
    expect(typeof back.date).toBe('string');
    expect(back.date).toBe('2026-06-01T08:00:00.000Z');
  });

  it('round-trips DTO → model → DTO without data loss', () => {
    expect(toTransactionDto(toTransaction(dto))).toEqual(dto);
  });
});
