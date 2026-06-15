import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

// Capacitor Preferences usa localStorage como fallback en web, por lo que estas
// pruebas ejercitan el round-trip real en el navegador de Karma.
describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    await service.clear();
  });

  afterEach(async () => {
    await service.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('stores and retrieves a string value', async () => {
    await service.set('k', 'v');
    expect(await service.get('k')).toBe('v');
  });

  it('returns null for a missing key', async () => {
    expect(await service.get('missing')).toBeNull();
  });

  it('round-trips JSON values', async () => {
    const value = { a: 1, b: ['x', 'y'] };
    await service.setJSON('obj', value);
    expect(await service.getJSON<typeof value>('obj')).toEqual(value);
  });

  it('returns null when JSON cannot be parsed', async () => {
    await service.set('bad', 'not-json');
    expect(await service.getJSON('bad')).toBeNull();
  });

  it('removes a value', async () => {
    await service.set('k', 'v');
    await service.remove('k');
    expect(await service.get('k')).toBeNull();
  });
});
