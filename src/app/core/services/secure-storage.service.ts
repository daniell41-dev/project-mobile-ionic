import { Injectable } from '@angular/core';
import { SecureStorage } from '@aparajita/capacitor-secure-storage';

/**
 * Almacenamiento **seguro** para datos sensibles (p. ej. el token de sesión).
 *
 * Respaldado por `@aparajita/capacitor-secure-storage`:
 *  - **Android:** cifrado con el **Keystore** del sistema.
 *  - **iOS:** **Keychain** (con niveles de accesibilidad).
 *  - **Web:** el plugin cae a un almacén del navegador (no hay enclave seguro
 *    en web; en producción real los datos sensibles solo deben confiarse al
 *    almacenamiento nativo).
 *
 * Misma forma de API que `StorageService` (clave-valor string) para que el
 * resto de la app dependa de la abstracción, no del plugin (Dependency
 * Inversion) y sea mockeable en tests.
 */
@Injectable({ providedIn: 'root' })
export class SecureStorageService {

  async get(key: string): Promise<string | null> {
    return SecureStorage.getItem(key);
  }

  async set(key: string, value: string): Promise<void> {
    await SecureStorage.setItem(key, value);
  }

  async remove(key: string): Promise<void> {
    await SecureStorage.remove(key);
  }

  async clear(): Promise<void> {
    await SecureStorage.clear();
  }
}
