import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonList, IonItem, IonLabel, IonIcon, IonNote, IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  walletOutline, snowOutline, globeOutline, lockClosedOutline,
  copyOutline, trendingUpOutline, cardOutline, notifications,
} from 'ionicons/icons';
import { DataService } from '../../core/services/data.service';
import { CurrencyMxnPipe } from '../../shared/pipes/currency-mxn.pipe';

@Component({
  selector: 'app-cards',
  templateUrl: 'cards.page.html',
  styleUrls: ['cards.page.scss'],
  imports: [
    RouterLink, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonList, IonItem, IonLabel, IonIcon, IonNote, IonBadge, CurrencyMxnPipe,
  ],
})
export class CardsPage {
  data = inject(DataService);

  frozen = signal<boolean>(false);
  onlinePurchases = signal<boolean>(true);

  constructor() {
    addIcons({
      walletOutline, snowOutline, globeOutline, lockClosedOutline,
      copyOutline, trendingUpOutline, cardOutline, notifications,
    });
    const c = this.data.cards()[0];
    if (c) {
      this.frozen.set(c.frozen);
      this.onlinePurchases.set(c.onlinePurchases);
    }
  }

  toggleFrozen(value: boolean): void { this.frozen.set(value); }
  toggleOnline(value: boolean): void { this.onlinePurchases.set(value); }
}
