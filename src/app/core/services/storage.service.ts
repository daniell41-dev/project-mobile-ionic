import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

/**
 * Almacenamiento persistente clave-valor sobre Capacitor Preferences.
 *
 * En nativo (iOS/Android) usa el almacenamiento seguro de la plataforma; en web
 * cae automáticamente a `localStorage`. Es la única puerta de acceso al storage:
 * el resto de la app depende de esta abstracción, no de la API de Capacitor
 * (Dependency Inversion), lo que permite mockearla en tests sin tocar nativo.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {

  async get(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value;
  }

  async getJSON<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  }

  async setJSON<T>(key: string, value: T): Promise<void> {
    await this.set(key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  }

  async clear(): Promise<void> {
    await Preferences.clear();
  }
}
