import { HapticsService } from './haptics.service';

// En el navegador de Karma `isNativePlatform()` es false, por lo que los
// métodos deben ser no-op y resolver sin lanzar (graceful fallback en web).
describe('HapticsService', () => {
  let service: HapticsService;

  beforeEach(() => {
    service = new HapticsService();
  });

  it('impact resuelve sin lanzar en web', async () => {
    await expectAsync(service.impact()).toBeResolved();
  });

  it('success resuelve sin lanzar en web', async () => {
    await expectAsync(service.success()).toBeResolved();
  });
});
