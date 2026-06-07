import { Component, inject, signal } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem,
  IonLabel, IonToggle, IonGrid, IonRow, IonCol, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosed, globe, keypad, copy, options, card } from 'ionicons/icons';
import { DataService } from '../../core/services/data.service';
import { CurrencyMxnPipe } from '../../shared/pipes/currency-mxn.pipe';

@Component({
  selector: 'app-cards',
  templateUrl: 'cards.page.html',
  styleUrls: ['cards.page.scss'],
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem,
    IonLabel, IonToggle, IonGrid, IonRow, IonCol, IonIcon, CurrencyMxnPipe,
  ],
})
export class CardsPage {
  data = inject(DataService);

  frozen = signal<boolean>(false);
  onlinePurchases = signal<boolean>(true);

  constructor() {
    addIcons({ lockClosed, globe, keypad, copy, options, card });
    const c = this.data.cards()[0];
    if (c) {
      this.frozen.set(c.frozen);
      this.onlinePurchases.set(c.onlinePurchases);
    }
  }

  toggleFrozen(value: boolean): void {
    this.frozen.set(value);
  }

  toggleOnline(value: boolean): void {
    this.onlinePurchases.set(value);
  }
}
