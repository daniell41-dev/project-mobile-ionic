import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Mock: usuario autenticado por defecto para desarrollo.
  // En producción se reemplaza con la lógica real de auth.
  readonly isAuthenticated = signal<boolean>(true);

  login(): void {
    this.isAuthenticated.set(true);
  }

  logout(): void {
    this.isAuthenticated.set(false);
  }
}
