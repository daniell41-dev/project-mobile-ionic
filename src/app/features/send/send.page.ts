import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonButton, IonSearchbar, IonList, IonItem, IonLabel, IonAvatar,
  IonFooter, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { DataService } from '../../core/services/data.service';
import { Contact } from '../../core/models/contact.model';
import { CurrencyMxnPipe } from '../../shared/pipes/currency-mxn.pipe';

@Component({
  selector: 'app-send',
  templateUrl: 'send.page.html',
  styleUrls: ['send.page.scss'],
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonButton, IonSearchbar, IonList, IonItem, IonLabel, IonAvatar,
    IonFooter, IonIcon, CurrencyMxnPipe,
  ],
})
export class SendPage {
  data = inject(DataService);
  private router = inject(Router);

  selectedContact = signal<Contact | null>(null);
  amount = signal<string>('0');
  step = signal<1 | 2>(1);

  // Filas del teclado numérico (estructura 4×3 correcta)
  readonly PAD_ROWS = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'del'],
  ];

  constructor() {
    addIcons({ arrowBackOutline });
  }

  get amountNumber(): number {
    return parseFloat(this.amount()) || 0;
  }

  selectContact(c: Contact): void {
    this.selectedContact.set(c);
    this.step.set(2);
  }

  pressKey(key: string): void {
    const cur = this.amount();
    if (key === 'del') {
      this.amount.set(cur.length > 1 ? cur.slice(0, -1) : '0');
    } else if (key === '.' && cur.includes('.')) {
      return;
    } else if (cur === '0' && key !== '.') {
      this.amount.set(key);
    } else {
      const parts = cur.split('.');
      if (parts[1]?.length >= 2) return;
      this.amount.set(cur + key);
    }
  }

  confirmSend(): void {
    this.router.navigateByUrl('/send/done');
  }
}
