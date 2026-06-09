import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('exposes seed data through signals', () => {
    expect(service.user().name).toBe('Andrea Salas');
    expect(service.transactions().length).toBeGreaterThan(0);
    expect(service.cards().length).toBe(1);
  });

  it('getTransactionById returns the matching transaction', () => {
    const tx = service.getTransactionById('t1');
    expect(tx).toBeDefined();
    expect(tx?.merchant).toContain('Nómina');
  });

  it('getTransactionById returns undefined for an unknown id', () => {
    expect(service.getTransactionById('nope')).toBeUndefined();
  });

  it('getRecentContacts returns only contacts flagged as recent', () => {
    const recent = service.getRecentContacts();
    expect(recent.length).toBeGreaterThan(0);
    expect(recent.every(c => c.recent)).toBeTrue();
  });
});
