import { TestBed } from '@angular/core/testing';
import { BiometricService } from './biometric.service';
import { StorageService } from './storage.service';

// Subclase de prueba: aísla las llamadas al plugin (proxy de Capacitor).
class TestableBiometricService extends BiometricService {
  available = true;
  verifyResult = true;
  override callIsAvailable() { return Promise.resolve({ available: this.available }); }
  override callAuthenticate(_reason: string) { return Promise.resolve({ verified: this.verifyResult }); }
}

class FakeStorageService {
  private map = new Map<string, string>();
  get = async (k: string) => this.map.get(k) ?? null;
  set = async (k: string, v: string) => { this.map.set(k, v); };
  remove = async (k: string) => { this.map.delete(k); };
}

describe('BiometricService', () => {
  let service: TestableBiometricService;
  let storage: FakeStorageService;

  beforeEach(() => {
    storage = new FakeStorageService();
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storage }],
    });
    service = TestBed.runInInjectionContext(() => new TestableBiometricService());
  });

  it('starts disabled', () => {
    expect(service.enabled()).toBeFalse();
  });

  it('isAvailable reflects the plugin result', async () => {
    service.available = false;
    expect(await service.isAvailable()).toBeFalse();
  });

  it('enable activates and persists when biometric verification succeeds', async () => {
    service.verifyResult = true;
    const ok = await service.enable();
    expect(ok).toBeTrue();
    expect(service.enabled()).toBeTrue();
    expect(await storage.get('nimbo-biometric-enabled')).toBe('true');
  });

  it('enable does not activate when verification fails', async () => {
    service.verifyResult = false;
    const ok = await service.enable();
    expect(ok).toBeFalse();
    expect(service.enabled()).toBeFalse();
  });

  it('disable turns it off and persists', async () => {
    service.verifyResult = true;
    await service.enable();
    await service.disable();
    expect(service.enabled()).toBeFalse();
    expect(await storage.get('nimbo-biometric-enabled')).toBe('false');
  });

  it('loadSetting rehydrates the persisted preference', async () => {
    await storage.set('nimbo-biometric-enabled', 'true');
    await service.loadSetting();
    expect(service.enabled()).toBeTrue();
  });
});
