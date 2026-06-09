import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TransactionsPage } from './transactions.page';
import { Transaction } from '../../core/models/transaction.model';

describe('TransactionsPage', () => {
  let component: TransactionsPage;
  let fixture: ComponentFixture<TransactionsPage>;

  const flatItems = (): Transaction[] =>
    component.groups().reduce<Transaction[]>((acc, g) => acc.concat(g.items), []);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('groups all transactions by day by default', () => {
    const labels = component.groups().map(g => g.label);
    expect(labels).toContain('Hoy');
    expect(labels).toContain('Ayer');
    // Every seeded transaction is present across the groups.
    const total = component.groups().reduce((n, g) => n + g.items.length, 0);
    expect(total).toBe(component.data.transactions().length);
  });

  it('filters to income only', () => {
    component.setFilter('income');
    const items = flatItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items.every(t => t.type === 'income')).toBeTrue();
  });

  it('filters to expenses only', () => {
    component.setFilter('expense');
    const items = flatItems();
    expect(items.every(t => t.type === 'expense')).toBeTrue();
  });

  it('searches by merchant in the client', () => {
    component.searchQuery.set('spotify');
    const items = flatItems();
    expect(items.length).toBe(1);
    expect(items[0].merchant).toContain('Spotify');
  });

  it('returns no groups when nothing matches', () => {
    component.searchQuery.set('zzz-no-match');
    expect(component.groups().length).toBe(0);
  });
});
