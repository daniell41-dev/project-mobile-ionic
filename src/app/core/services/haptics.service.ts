import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Feedback háptico nativo. Encapsula `@capacitor/haptics` y **degrada con
 * elegancia** en web (no-op), de modo que las páginas no dependan del plugin ni
 * de la detección de plataforma.
 */
@Injectable({ providedIn: 'root' })
export class HapticsService {
  private get available(): boolean {
    return Capacitor.isNativePlatform();
  }

  /** Toque ligero para confirmaciones de UI (p. ej. toggles). */
  async impact(style: ImpactStyle = ImpactStyle.Medium): Promise<void> {
    if (!this.available) return;
    try { await Haptics.impact({ style }); } catch { /* no-op */ }
  }

  /** Patrón de éxito (p. ej. transferencia enviada). */
  async success(): Promise<void> {
    if (!this.available) return;
    try { await Haptics.notification({ type: NotificationType.Success }); } catch { /* no-op */ }
  }
}
