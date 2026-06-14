import { CurrencyMxnPipe } from '../../src/app/shared/pipes/currency-mxn.pipe';

// Spec ejecutado con Jest (runner alternativo a Karma).
describe('CurrencyMxnPipe (Jest)', () => {
  const pipe = new CurrencyMxnPipe();

  it('formats a positive amount as MXN', () => {
    expect(pipe.transform(48250.75)).toBe('$48,250.75');
  });

  it('formats zero', () => {
    expect(pipe.transform(0)).toBe('$0.00');
  });

  it('falls back to $0.00 for null/undefined', () => {
    expect(pipe.transform(null)).toBe('$0.00');
    expect(pipe.transform(undefined)).toBe('$0.00');
  });
});
