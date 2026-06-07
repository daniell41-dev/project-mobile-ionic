import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonButtons, IonButton,
  IonIcon, IonBadge, IonAvatar, IonCard, IonCardContent,
  IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonNote,
  IonProgressBar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notifications, eye, eyeOff, send, arrowDown, flash, qrCode } from 'ionicons/icons';
import { DataService } from '../../core/services/data.service';
import { CurrencyMxnPipe } from '../../shared/pipes/currency-mxn.pipe';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonContent, IonHeader, IonToolbar, IonButtons, IonButton,
    IonIcon, IonBadge, IonAvatar, IonCard, IonCardContent,
    IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonNote,
    IonProgressBar, CurrencyMxnPipe,
  ],
})
export class HomePage {
  data = inject(DataService);
  private router = inject(Router);

  balanceHidden = false;

  constructor() {
    addIcons({ notifications, eye, eyeOff, send, arrowDown, flash, qrCode });
  }

  toggleBalance(): void {
    this.balanceHidden = !this.balanceHidden;
  }

  openNotifications(): void {
    this.router.navigateByUrl('/notifications');
  }

  openSend(): void {
    this.router.navigateByUrl('/send');
  }

  openTxDetail(id: string): void {
    this.router.navigateByUrl(`/transactions/${id}`);
  }

  get recentTransactions() {
    return this.data.transactions().slice(0, 4);
  }
}
