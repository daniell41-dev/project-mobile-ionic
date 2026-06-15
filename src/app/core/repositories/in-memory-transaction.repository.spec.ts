import { firstValueFrom } from 'rxjs';
import { InMemoryTransactionRepository } from './in-memory-transaction.repository';
import { TRANSACTION_SEED } from './transaction.seed';

describe('InMemoryTransactionRepository', () => {
  let repo: InMemoryTransactionRepository;

  beforeEach(() => {
    repo = new InMemoryTransactionRepository();
  });

  it('getAll returns all seed transactions', async () => {
    const all = await firstValueFrom(repo.getAll());
    expect(all.length).toBe(TRANSACTION_SEED.length);
  });

  it('getAll returns a fresh array copy (not the seed reference)', async () => {
    const all = await firstValueFrom(repo.getAll());
    expect(all).not.toBe(TRANSACTION_SEED);
    expect(all).toEqual(TRANSACTION_SEED);
  });

  it('getById returns the matching transaction', async () => {
    const tx = await firstValueFrom(repo.getById('t1'));
    expect(tx?.merchant).toContain('Nómina');
  });

  it('getById returns undefined for an unknown id', async () => {
    expect(await firstValueFrom(repo.getById('nope'))).toBeUndefined();
  });
});
