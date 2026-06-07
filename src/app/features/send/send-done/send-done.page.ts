import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon, IonChip } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';

@Component({
  selector: 'app-send-done',
  templateUrl: 'send-done.page.html',
  styleUrls: ['send-done.page.scss'],
  imports: [IonContent, IonButton, IonIcon, IonChip],
})
export class SendDonePage {
  private router = inject(Router);

  constructor() {
    addIcons({ checkmarkCircle });
  }

  goHome(): void {
    this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
  }
}
