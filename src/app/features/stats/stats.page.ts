import { Component, inject, signal } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonSegment,
  IonSegmentButton, IonLabel, IonCard, IonCardContent, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bulb } from 'ionicons/icons';
import { DataService } from '../../core/services/data.service';
import { CurrencyMxnPipe } from '../../shared/pipes/currency-mxn.pipe';

type Period = 'week' | 'month' | 'year';

@Component({
  selector: 'app-stats',
  templateUrl: 'stats.page.html',
  styleUrls: ['stats.page.scss'],
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonSegment,
    IonSegmentButton, IonLabel, IonCard, IonCardContent, IonIcon, CurrencyMxnPipe,
  ],
})
export class StatsPage {
  data = inject(DataService);
  period = signal<Period>('month');

  constructor() {
    addIcons({ bulb });
  }

  setPeriod(value: Period): void {
    this.period.set(value);
  }

  /** Construye el conic-gradient del donut a partir de los porcentajes. */
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
    return this.data.statsMonthly().find(m => m.current)?.amount ?? 0;
  }

  get maxMonthly(): number {
    return Math.max(...this.data.statsMonthly().map(m => m.amount));
  }

  barHeight(amount: number): string {
    return `${(amount / this.maxMonthly) * 100}%`;
  }
}
