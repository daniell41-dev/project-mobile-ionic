import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

/**
 * Captura de foto de perfil mediante `@capacitor/camera`.
 *
 * En nativo abre cámara/galería; en web usa el selector de archivos del plugin.
 * `capture()` está aislado (protected) para poder mockearlo en tests sin tocar
 * el proxy del plugin. Si el usuario cancela o hay error, devuelve `null`.
 */
@Injectable({ providedIn: 'root' })
export class CameraService {

  async takeAvatarPhoto(): Promise<string | null> {
    try {
      const photo = await this.capture();
      return photo.dataUrl ?? null;
    } catch {
      return null; // cancelado o no disponible
    }
  }

  protected capture(): Promise<Photo> {
    return Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      quality: 80,
      allowEditing: false,
    });
  }
}
