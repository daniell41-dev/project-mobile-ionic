import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Sincroniza la barra de estado nativa con el tema de la app. `@capacitor/status-bar`
 * no tiene implementación web, por lo que se protege con `isNativePlatform()`
 * (no-op en navegador / PWA).
 */
@Injectable({ providedIn: 'root' })
export class StatusBarService {
  private get available(): boolean {
    return Capacitor.isNativePlatform();
  }

  /** Aplica el estilo de la barra de estado según el tema actual. */
  async apply(isDark: boolean): Promise<void> {
    if (!this.available) return;
    try {
      // Style.Dark = texto claro (para fondos oscuros) y viceversa.
      await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
    } catch { /* no-op */ }
  }
}
