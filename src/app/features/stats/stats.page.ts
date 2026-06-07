import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardContent,
  IonIcon, IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notifications, trendingUpOutline, flameOutline } from 'ionicons/icons';
import { DataService } from '../../core/services/data.service';
import { CurrencyMxnPipe } from '../../shared/pipes/currency-mxn.pipe';

type Period = 'week' | 'month' | 'year';

@Component({
  selector: 'app-stats',
  templateUrl: 'stats.page.html',
  styleUrls: ['stats.page.scss'],
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardContent,
    IonIcon, IonBadge, CurrencyMxnPipe,
  ],
})
export class StatsPage {
  data = inject(DataService);
  private router = inject(Router);
  period = signal<Period>('month');

  constructor() {
    addIcons({ notifications, trendingUpOutline, flameOutline });
  }

  setPeriod(value: Period): void { this.period.set(value); }
  openNotifications(): void { this.router.navigateByUrl('/notifications'); }

  get donutGradient(): string {
    let acc = 0;
    const stops = this.data.statsCategories().map(c => {
      const start = acc;
      acc += c.percent;
      return `${c.color} ${start}% ${acc}%`;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }

  get totalSpent(): number {
    return this.data.statsCategories().reduce((s, c) => s + c.amount, 0);
  }

  get maxMonthly(): number {
    return Math.max(...this.data.statsMonthly().map(m => m.amount));
  }

  barHeight(amount: number): string {
    return `${(amount / this.maxMonthly) * 100}%`;
  }
}
