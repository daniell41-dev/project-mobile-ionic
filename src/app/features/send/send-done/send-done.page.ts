import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-send-done',
  templateUrl: 'send-done.page.html',
  styleUrls: ['send-done.page.scss'],
  imports: [IonContent, IonButton, IonIcon],
})
export class SendDonePage {
  private router = inject(Router);

  constructor() {
    addIcons({ checkmarkOutline, timeOutline });
  }

  goHome(): void {
    this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
  }
}
