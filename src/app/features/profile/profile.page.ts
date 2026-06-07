import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent,
  IonChip, IonIcon, IonList, IonListHeader, IonItem, IonLabel, IonToggle,
  IonButton, IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircle, person, business, shieldCheckmark, notifications,
  globe, helpCircle, moon, logOut,
} from 'ionicons/icons';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent,
    IonChip, IonIcon, IonList, IonListHeader, IonItem, IonLabel, IonToggle,
    IonButton, IonNote,
  ],
})
export class ProfilePage {
  data = inject(DataService);
  theme = inject(ThemeService);
  private auth = inject(AuthService);
  private router = inject(Router);

  constructor() {
    addIcons({
      checkmarkCircle, person, business, shieldCheckmark, notifications,
      globe, helpCircle, moon, logOut,
    });
  }

  toggleTheme(isDark: boolean): void {
    this.theme.setTheme(isDark ? 'dark' : 'light');
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/onboarding', { replaceUrl: true });
  }
}
