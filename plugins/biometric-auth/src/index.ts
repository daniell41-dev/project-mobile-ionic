import { registerPlugin } from '@capacitor/core';
import type { BiometricAuthPlugin } from './definitions';

/**
 * Registra el plugin con Capacitor. En nativo enruta a la implementación
 * Android/iOS; en web carga `BiometricAuthWeb` de forma diferida.
 */
export const BiometricAuth = registerPlugin<BiometricAuthPlugin>('BiometricAuth', {
  web: () => import('./web').then(m => new m.BiometricAuthWeb()),
});

export * from './definitions';
