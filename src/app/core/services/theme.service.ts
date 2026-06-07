import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'nimbo-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storage = inject(StorageService);

  // Valor por defecto coherente con el <html class="dark"> de index.html.
  // El tema persistido se resuelve de forma asíncrona en initialize().
  readonly theme = signal<Theme>('dark');

  /** Resuelve el tema persistido (o la preferencia del sistema) y lo aplica. */
  async initialize(): Promise<void> {
    const saved = (await this.storage.get(STORAGE_KEY)) as Theme | null;
    const theme = saved ?? (this.prefersDark() ? 'dark' : 'light');
    this.theme.set(theme);
    this.applyTheme(theme);
  }

  toggle(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.applyTheme(theme);
    // Persistencia best-effort; no bloquea la UI.
    void this.storage.set(STORAGE_KEY, theme);
  }

  isDark(): boolean {
    return this.theme() === 'dark';
  }

  private prefersDark(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(theme: Theme): void {
    const html = document.documentElement;
    html.classList.toggle('dark', theme === 'dark');
    html.classList.toggle('light', theme === 'light');
  }
}
