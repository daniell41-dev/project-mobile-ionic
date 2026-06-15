import { CurrencyMxnPipe } from './currency-mxn.pipe';

describe('CurrencyMxnPipe', () => {
  let pipe: CurrencyMxnPipe;

  beforeEach(() => {
    pipe = new CurrencyMxnPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format a positive amount as MXN currency', () => {
    // El formato es-MX usa "$" y 2 decimales.
    const result = pipe.transform(48250.75);
    expect(result).toContain('48,250.75');
    expect(result).toContain('$');
  });

  it('should format zero', () => {
    expect(pipe.transform(0)).toContain('0.00');
  });

  it('should fallback to $0.00 for null/undefined', () => {
    expect(pipe.transform(null)).toBe('$0.00');
    expect(pipe.transform(undefined)).toBe('$0.00');
  });
});
