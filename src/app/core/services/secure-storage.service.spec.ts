import { SecureStorageService } from './secure-storage.service';

// El plugin resuelve a su implementación web en el navegador de Karma, por lo
// que estas pruebas ejercitan un round-trip real (set → get → remove).
describe('SecureStorageService', () => {
  let service: SecureStorageService;

  beforeEach(async () => {
    service = new SecureStorageService();
    await service.clear();
  });

  afterEach(async () => {
    await service.clear();
  });

  it('almacena y recupera un valor', async () => {
    await service.set('k', 'v');
    expect(await service.get('k')).toBe('v');
  });

  it('devuelve null para una clave inexistente', async () => {
    expect(await service.get('missing')).toBeNull();
  });

  it('elimina un valor', async () => {
    await service.set('k', 'v');
    await service.remove('k');
    expect(await service.get('k')).toBeNull();
  });
});
