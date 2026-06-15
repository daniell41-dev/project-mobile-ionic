import { inject, Injectable, signal } from '@angular/core';
import { BiometricAuth } from 'biometric-auth';
import { StorageService } from './storage.service';

const ENABLED_KEY = 'nimbo-biometric-enabled';

/**
 * Envuelve el plugin Capacitor propio `BiometricAuth` y gestiona la preferencia
 * "Seguridad y biometría". Las llamadas al plugin se aíslan en métodos
 * `protected` para poder mockearlas en tests sin tocar el proxy de Capacitor.
 */
@Injectable({ providedIn: 'root' })
export class BiometricService {
  private storage = inject(StorageService);

  /** Si el bloqueo biométrico está activado (preferencia del usuario). */
  readonly enabled = signal<boolean>(false);

  /** Carga la preferencia persistida (llamar al iniciar Perfil). */
  async loadSetting(): Promise<void> {
    this.enabled.set((await this.storage.get(ENABLED_KEY)) === 'true');
  }

  /** ¿El dispositivo soporta biometría? */
  async isAvailable(): Promise<boolean> {
    return (await this.callIsAvailable()).available;
  }

  /**
   * Activa el bloqueo: exige una verificación biométrica correcta antes de
   * persistir la preferencia. Devuelve si quedó activado.
   */
  async enable(): Promise<boolean> {
    const { verified } = await this.callAuthenticate('Activa el acceso biométrico a Nimbo');
    if (verified) {
      this.enabled.set(true);
      await this.storage.set(ENABLED_KEY, 'true');
    }
    return verified;
  }

  /** Desactiva el bloqueo biométrico. */
  async disable(): Promise<void> {
    this.enabled.set(false);
    await this.storage.set(ENABLED_KEY, 'false');
  }

  protected callIsAvailable(): Promise<{ available: boolean }> {
    return BiometricAuth.isAvailable();
  }

  protected callAuthenticate(reason: string): Promise<{ verified: boolean }> {
    return BiometricAuth.authenticate({ reason });
  }
}
