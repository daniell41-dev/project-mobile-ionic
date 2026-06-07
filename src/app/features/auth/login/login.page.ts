import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonLabel],
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  login(): void {
    this.auth.login();
    this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
  }
}
