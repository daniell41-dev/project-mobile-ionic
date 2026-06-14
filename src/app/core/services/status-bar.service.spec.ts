import { StatusBarService } from './status-bar.service';

// En web `isNativePlatform()` es false → apply() es no-op y resuelve sin tocar
// el plugin (que no tiene implementación web).
describe('StatusBarService', () => {
  let service: StatusBarService;

  beforeEach(() => {
    service = new StatusBarService();
  });

  it('apply(true) resuelve sin lanzar en web', async () => {
    await expectAsync(service.apply(true)).toBeResolved();
  });

  it('apply(false) resuelve sin lanzar en web', async () => {
    await expectAsync(service.apply(false)).toBeResolved();
  });
});
