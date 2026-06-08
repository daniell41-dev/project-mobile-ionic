import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonIcon, IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logoApple, globeOutline, arrowBackOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  imports: [
    ReactiveFormsModule, IonContent, IonIcon, IonSpinner,
  ],
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private location = inject(Location);
  private fb = inject(FormBuilder);

  loading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);

  form = this.fb.nonNullable.group({
    email: ['demo@nimbo.mx', [Validators.required, Validators.email]],
    password: ['nimbo123', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logoApple, globeOutline, arrowBackOutline });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set(null);
    const { email, password } = this.form.getRawValue();
    const ok = await this.auth.login(email, password);
    this.loading.set(false);
    if (ok) {
      this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
    } else {
      this.error.set('Correo o contraseña incorrectos.');
    }
  }

  goBack(): void { this.location.back(); }

  async loginSocial(): Promise<void> {
    await this.auth.login('demo@nimbo.mx', 'nimbo123');
    this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
  }
}
