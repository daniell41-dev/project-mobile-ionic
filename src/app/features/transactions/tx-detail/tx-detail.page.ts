import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton,
  IonIcon, IonList, IonItem, IonLabel, IonNote, IonChip,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisHorizontal, download, warning } from 'ionicons/icons';
import { DataService } from '../../../core/services/data.service';
import { Transaction } from '../../../core/models/transaction.model';
import { CurrencyMxnPipe } from '../../../shared/pipes/currency-mxn.pipe';

@Component({
  selector: 'app-tx-detail',
  templateUrl: 'tx-detail.page.html',
  styleUrls: ['tx-detail.page.scss'],
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton,
    IonIcon, IonList, IonItem, IonLabel, IonNote, IonChip, CurrencyMxnPipe, DatePipe,
  ],
})
export class TxDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);

  tx = signal<Transaction | undefined>(undefined);

  constructor() {
    addIcons({ ellipsisHorizontal, download, warning });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.tx.set(this.data.getTransactionById(id));
  }
}
