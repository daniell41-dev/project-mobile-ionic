import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { SecureStorageService } from './secure-storage.service';

// Fake en memoria del almacenamiento seguro: aísla AuthService del plugin nativo.
class FakeSecureStorageService {
  private map = new Map<string, string>();
  get = async (key: string) => this.map.get(key) ?? null;
  set = async (key: string, value: string) => { this.map.set(key, value); };
  remove = async (key: string) => { this.map.delete(key); };
}

describe('AuthService', () => {
  let service: AuthService;
  let storage: FakeSecureStorageService;

  beforeEach(() => {
    storage = new FakeSecureStorageService();
    TestBed.configureTestingModule({
      providers: [{ provide: SecureStorageService, useValue: storage }],
    });
    service = TestBed.inject(AuthService);
  });

  it('starts unauthenticated', () => {
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getToken()).toBeNull();
  });

  it('authenticates with valid demo credentials and persists the token', async () => {
    const ok = await service.login('demo@nimbo.mx', 'nimbo123');
    expect(ok).toBeTrue();
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getToken()).not.toBeNull();
    expect(await storage.get('nimbo-auth-token')).toBe(service.getToken());
  });

  it('accepts the email case-insensitively and trims whitespace', async () => {
    expect(await service.login('  DEMO@Nimbo.MX  ', 'nimbo123')).toBeTrue();
  });

  it('rejects invalid credentials without storing a token', async () => {
    const ok = await service.login('demo@nimbo.mx', 'wrong');
    expect(ok).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
    expect(await storage.get('nimbo-auth-token')).toBeNull();
  });

  it('logout clears the token and persisted state', async () => {
    await service.login('demo@nimbo.mx', 'nimbo123');
    await service.logout();
    expect(service.isAuthenticated()).toBeFalse();
    expect(await storage.get('nimbo-auth-token')).toBeNull();
  });

  it('restoreSession rehydrates the token from storage', async () => {
    await storage.set('nimbo-auth-token', 'persisted-token');
    await service.restoreSession();
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getToken()).toBe('persisted-token');
  });
});
