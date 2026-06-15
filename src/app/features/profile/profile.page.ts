import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmark, personOutline, businessOutline, shieldCheckmarkOutline,
  notificationsOutline, globeOutline, helpCircleOutline, moonOutline,
  logOutOutline, chevronForward, cameraOutline,
} from 'ionicons/icons';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { CameraService } from '../../core/services/camera.service';
import { BiometricService } from '../../core/services/biometric.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
  ],
})
export class ProfilePage {
  data = inject(DataService);
  theme = inject(ThemeService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private camera = inject(CameraService);
  biometric = inject(BiometricService);

  /** Foto de avatar capturada (data URL). Si es null se muestran las iniciales. */
  avatarPhoto = signal<string | null>(null);

  constructor() {
    void this.biometric.loadSetting();
    addIcons({
      checkmark, personOutline, businessOutline, shieldCheckmarkOutline,
      notificationsOutline, globeOutline, helpCircleOutline, moonOutline,
      logOutOutline, chevronForward, cameraOutline,
    });
  }

  toggleTheme(isDark: boolean): void {
    this.theme.setTheme(isDark ? 'dark' : 'light');
  }

  /** Captura/selecciona una foto de avatar (cámara nativa o selector web). */
  async changeAvatar(): Promise<void> {
    const dataUrl = await this.camera.takeAvatarPhoto();
    if (dataUrl) this.avatarPhoto.set(dataUrl);
  }

  /** Activa/desactiva el bloqueo biométrico (plugin Capacitor propio). */
  async toggleBiometric(): Promise<void> {
    if (this.biometric.enabled()) {
      await this.biometric.disable();
    } else {
      await this.biometric.enable();
    }
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigateByUrl('/onboarding', { replaceUrl: true });
  }
}
