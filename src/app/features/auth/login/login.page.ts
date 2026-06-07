import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput,
  IonItem, IonLabel, IonText, IonSpinner,
} from '@ionic/angular/standalone';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  imports: [
    ReactiveFormsModule, IonContent, IonHeader, IonToolbar, IonTitle,
    IonButton, IonInput, IonItem, IonLabel, IonText, IonSpinner,
  ],
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loading = signal(false);
  error = signal<string | null>(null);

  // Prellenado con las credenciales de demo para una revisión sin fricción.
  form = this.fb.nonNullable.group({
    email: ['demo@nimbo.mx', [Validators.required, Validators.email]],
    password: ['nimbo123', [Validators.required, Validators.minLength(6)]],
  });

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
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
}
