import { firstValueFrom } from 'rxjs';
import { InMemoryTransactionRepository } from '../../src/app/core/repositories/in-memory-transaction.repository';
import { TRANSACTION_SEED } from '../../src/app/core/repositories/transaction.seed';

// Spec ejecutado con Jest sobre el repositorio in-memory (RxJS, sin Capacitor).
describe('InMemoryTransactionRepository (Jest)', () => {
  const repo = new InMemoryTransactionRepository();

  it('getAll returns all seed transactions', async () => {
    const all = await firstValueFrom(repo.getAll());
    expect(all).toHaveLength(TRANSACTION_SEED.length);
  });

  it('getById returns the matching transaction', async () => {
    const tx = await firstValueFrom(repo.getById('t1'));
    expect(tx?.merchant).toContain('Nómina');
  });

  it('getById returns undefined for an unknown id', async () => {
    await expect(firstValueFrom(repo.getById('nope'))).resolves.toBeUndefined();
  });
});
