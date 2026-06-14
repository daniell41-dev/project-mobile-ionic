import { Photo } from '@capacitor/camera';
import { CameraService } from './camera.service';

// Subclase de prueba que expone/forza `capture()` sin invocar el plugin real.
class TestableCameraService extends CameraService {
  override capture(): Promise<Photo> {
    return Promise.reject(new Error('not stubbed'));
  }
}

describe('CameraService', () => {
  let service: TestableCameraService;

  beforeEach(() => {
    service = new TestableCameraService();
  });

  it('devuelve el dataUrl cuando la captura tiene éxito', async () => {
    spyOn(service, 'capture').and.resolveTo({ dataUrl: 'data:image/png;base64,AAA' } as Photo);
    expect(await service.takeAvatarPhoto()).toBe('data:image/png;base64,AAA');
  });

  it('devuelve null cuando el usuario cancela o hay error', async () => {
    spyOn(service, 'capture').and.rejectWith(new Error('cancelled'));
    expect(await service.takeAvatarPhoto()).toBeNull();
  });

  it('devuelve null cuando la foto no trae dataUrl', async () => {
    spyOn(service, 'capture').and.resolveTo({} as Photo);
    expect(await service.takeAvatarPhoto()).toBeNull();
  });
});
