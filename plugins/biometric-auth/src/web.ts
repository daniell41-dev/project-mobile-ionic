import { WebPlugin } from '@capacitor/core';
import type {
  BiometricAuthPlugin,
  AuthenticateOptions,
  AuthenticateResult,
  IsAvailableResult,
} from './definitions';

/**
 * Implementación web del plugin. El navegador no tiene biometría del sistema,
 * por lo que `isAvailable` devuelve `false`. `authenticate` resuelve `verified`
 * para no bloquear la demo PWA (degradación elegante).
 */
export class BiometricAuthWeb extends WebPlugin implements BiometricAuthPlugin {
  async isAvailable(): Promise<IsAvailableResult> {
    return { available: false, reason: 'Biometría no disponible en web' };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async authenticate(_options: AuthenticateOptions): Promise<AuthenticateResult> {
    return { verified: true };
  }
}
