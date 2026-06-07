import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { walletOutline } from 'ionicons/icons';

@Component({
  selector: 'app-onboarding',
  templateUrl: 'onboarding.page.html',
  styleUrls: ['onboarding.page.scss'],
  imports: [IonContent, IonButton, IonIcon],
})
export class OnboardingPage {
  private router = inject(Router);

  constructor() {
    addIcons({ walletOutline });
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
