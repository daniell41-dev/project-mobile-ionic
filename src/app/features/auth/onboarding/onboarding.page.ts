import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { wallet } from 'ionicons/icons';

@Component({
  selector: 'app-onboarding',
  templateUrl: 'onboarding.page.html',
  styleUrls: ['onboarding.page.scss'],
  imports: [IonContent, IonIcon],
})
export class OnboardingPage {
  private router = inject(Router);

  constructor() {
    addIcons({ wallet });
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
