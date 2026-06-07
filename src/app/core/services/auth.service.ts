import { computed, inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

const TOKEN_KEY = 'nimbo-auth-token';

// Credenciales de demostración para el portafolio. En un backend real, login()
// haría POST {apiBaseUrl}/auth/login y recibiría el token del servidor.
const DEMO_EMAIL = 'demo@nimbo.mx';
const DEMO_PASSWORD = 'nimbo123';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storage = inject(StorageService);

  private readonly _token = signal<string | null>(null);
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);

  /**
   * Restaura la sesión desde el almacenamiento persistente. Se ejecuta en el
   * arranque (provideAppInitializer) para que el guard vea el estado correcto.
   */
  async restoreSession(): Promise<void> {
    const token = await this.storage.get(TOKEN_KEY);
    this._token.set(token);
  }

  /** Valida credenciales, persiste el token y actualiza el estado. */
  async login(email: string, password: string): Promise<boolean> {
    const valid =
      email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
    if (!valid) return false;

    const token = this.issueToken(email);
    await this.storage.set(TOKEN_KEY, token);
    this._token.set(token);
    return true;
  }

  /** Cierra la sesión y limpia el token persistido. */
  async logout(): Promise<void> {
    await this.storage.remove(TOKEN_KEY);
    this._token.set(null);
  }

  getToken(): string | null {
    return this._token();
  }

  // Token opaco simulado. Reemplazable por el JWT que devuelva la API real.
  private issueToken(email: string): string {
    return btoa(`${email}:${Date.now()}`);
  }
}
