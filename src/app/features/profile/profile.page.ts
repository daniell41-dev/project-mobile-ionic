import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmark, personOutline, businessOutline, shieldCheckmarkOutline,
  notificationsOutline, globeOutline, helpCircleOutline, moonOutline,
  logOutOutline, chevronForward,
} from 'ionicons/icons';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

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

  constructor() {
    addIcons({
      checkmark, personOutline, businessOutline, shieldCheckmarkOutline,
      notificationsOutline, globeOutline, helpCircleOutline, moonOutline,
      logOutOutline, chevronForward,
    });
  }

  toggleTheme(isDark: boolean): void {
    this.theme.setTheme(isDark ? 'dark' : 'light');
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigateByUrl('/onboarding', { replaceUrl: true });
  }
}
