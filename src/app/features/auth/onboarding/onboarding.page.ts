import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-onboarding',
  templateUrl: 'onboarding.page.html',
  imports: [IonContent, IonButton],
})
export class OnboardingPage {
  private router = inject(Router);

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
