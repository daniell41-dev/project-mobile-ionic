import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonIcon, IonSearchbar, IonList, IonItem, IonLabel, IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notifications } from 'ionicons/icons';
import { DataService } from '../../core/services/data.service';
import { Transaction } from '../../core/models/transaction.model';
import { CurrencyMxnPipe } from '../../shared/pipes/currency-mxn.pipe';

type Filter = 'all' | 'income' | 'expense';

export interface TxGroup { label: string; items: Transaction[]; }

@Component({
  selector: 'app-transactions',
  templateUrl: 'transactions.page.html',
  styleUrls: ['transactions.page.scss'],
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonIcon, IonSearchbar, IonList, IonItem, IonLabel, IonNote, CurrencyMxnPipe,
  ],
})
export class TransactionsPage {
  data = inject(DataService);
  private router = inject(Router);

  filter = signal<Filter>('all');
  searchQuery = signal<string>('');

  constructor() {
    addIcons({ notifications });
  }

  setFilter(value: Filter): void {
    this.filter.set(value);
  }

  readonly groups = computed<TxGroup[]>(() => {
    const q = this.searchQuery().toLowerCase();
    const filtered = this.data.transactions().filter(tx => {
      const matchFilter =
        this.filter() === 'all' ||
        (this.filter() === 'income' && tx.type === 'income') ||
        (this.filter() === 'expense' && tx.type === 'expense');
      const matchSearch = !q || tx.merchant.toLowerCase().includes(q) || tx.category.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });

    // Group by day label
    const map = new Map<string, Transaction[]>();
    for (const tx of filtered) {
      const key = tx.day ?? tx.date;
      const group = map.get(key) ?? [];
      group.push(tx);
      map.set(key, group);
    }
    return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
  });

  openDetail(id: string): void {
    this.router.navigateByUrl(`/transactions/${id}`);
  }

  openNotifications(): void {
    this.router.navigateByUrl('/notifications');
  }
}
