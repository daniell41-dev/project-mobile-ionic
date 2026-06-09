import {
  AfterViewInit, Component, ElementRef, inject,
  OnDestroy, signal, ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Chart, DoughnutController, ArcElement, Tooltip as ChartTooltip,
  BarController, BarElement, CategoryScale, LinearScale,
} from 'chart.js';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notifications, trendingUpOutline, trendingDownOutline, flameOutline } from 'ionicons/icons';
import { CurrencyMxnPipe } from '../../shared/pipes/currency-mxn.pipe';

Chart.register(DoughnutController, ArcElement, ChartTooltip, BarController, BarElement, CategoryScale, LinearScale);

type Period = 'week' | 'month' | 'year';

interface CatItem { name: string; percent: number; amount: number; color: string; }
interface BarItem { label: string; amount: number; current?: boolean; }
interface PeriodData {
  label: string;
  trend: string;
  trendPositive: boolean;
  categories: CatItem[];
  bars: BarItem[];
}

const PERIOD_DATA: Record<Period, PeriodData> = {
  week: {
    label: 'Esta semana',
    trend: '−12% vs sem. ant.',
    trendPositive: false,
    categories: [
      { name: 'Compras',    percent: 40, amount: 1240, color: '#4C8DFF' },
      { name: 'Comida',     percent: 28, amount:  868, color: '#B98BFF' },
      { name: 'Transporte', percent: 18, amount:  558, color: '#F5A623' },
      { name: 'Otros',      percent: 14, amount:  434, color: '#7C879A' },
    ],
    bars: [
      { label: 'L', amount:  420 },
      { label: 'M', amount:  680 },
      { label: 'X', amount:  310 },
      { label: 'J', amount:  850 },
      { label: 'V', amount:  720 },
      { label: 'S', amount: 1100, current: true },
      { label: 'D', amount:    0 },
    ],
  },
  month: {
    label: 'Junio',
    trend: '−8% vs may',
    trendPositive: false,
    categories: [
      { name: 'Compras',       percent: 32, amount: 4180, color: '#4C8DFF' },
      { name: 'Servicios',     percent: 18, amount: 2350, color: '#3FD1A0' },
      { name: 'Transporte',    percent: 15, amount: 1960, color: '#F5A623' },
      { name: 'Comida',        percent: 13, amount: 1700, color: '#B98BFF' },
      { name: 'Suscripciones', percent:  9, amount: 1175, color: '#FF8A8A' },
      { name: 'Otros',         percent: 13, amount: 1700, color: '#7C879A' },
    ],
    bars: [
      { label: 'Ene', amount: 5500 },
      { label: 'Feb', amount: 7200 },
      { label: 'Mar', amount: 4800 },
      { label: 'Abr', amount: 8400 },
      { label: 'May', amount: 6600 },
      { label: 'Jun', amount: 9300, current: true },
    ],
  },
  year: {
    label: '2025',
    trend: '+5% vs 2024',
    trendPositive: true,
    categories: [
      { name: 'Compras',       percent: 35, amount: 24500, color: '#4C8DFF' },
      { name: 'Servicios',     percent: 20, amount: 14000, color: '#3FD1A0' },
      { name: 'Transporte',    percent: 14, amount:  9800, color: '#F5A623' },
      { name: 'Comida',        percent: 15, amount: 10500, color: '#B98BFF' },
      { name: 'Suscripciones', percent:  8, amount:  5600, color: '#FF8A8A' },
      { name: 'Otros',         percent:  8, amount:  5600, color: '#7C879A' },
    ],
    bars: [
      { label: '2021', amount: 42000 },
      { label: '2022', amount: 58000 },
      { label: '2023', amount: 71000 },
      { label: '2024', amount: 65000 },
      { label: '2025', amount: 83000, current: true },
    ],
  },
};

@Component({
  selector: 'app-stats',
  templateUrl: 'stats.page.html',
  styleUrls: ['stats.page.scss'],
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardContent,
    IonIcon, CurrencyMxnPipe,
  ],
})
export class StatsPage implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  period = signal<Period>('month');

  @ViewChild('donutCanvas') private donutRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas')   private barRef!:   ElementRef<HTMLCanvasElement>;

  private donutChart: Chart | null = null;
  private barChart:   Chart | null = null;

  constructor() {
    addIcons({ notifications, trendingUpOutline, trendingDownOutline, flameOutline });
  }

  get pd(): PeriodData { return PERIOD_DATA[this.period()]; }
  get totalSpent(): number { return this.pd.categories.reduce((s, c) => s + c.amount, 0); }

  ngAfterViewInit(): void { this.buildCharts(); }

  ngOnDestroy(): void {
    this.donutChart?.destroy();
    this.barChart?.destroy();
  }

  setPeriod(v: Period): void { this.period.set(v); this.buildCharts(); }
  openNotifications(): void { this.router.navigateByUrl('/notifications'); }

  private buildCharts(): void {
    this.buildDonut();
    this.buildBar();
  }

  private buildDonut(): void {
    this.donutChart?.destroy();
    const ctx = this.donutRef.nativeElement.getContext('2d')!;
    this.donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.pd.categories.map(c => c.name),
        datasets: [{
          data: this.pd.categories.map(c => c.amount),
          backgroundColor: this.pd.categories.map(c => c.color),
          hoverBackgroundColor: this.pd.categories.map(c => c.color),
          borderWidth: 0,
          hoverOffset: 6,
        }],
      },
      options: {
        cutout: '65%',
        responsive: true,
        maintainAspectRatio: true,
        animation: { duration: 450 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(20,24,31,0.92)',
            titleColor: '#EEF1F6',
            bodyColor: '#9BA4B3',
            padding: 10,
            cornerRadius: 10,
          },
        },
      },
    });
  }

  private buildBar(): void {
    this.barChart?.destroy();
    const ctx = this.barRef.nativeElement.getContext('2d')!;
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.pd.bars.map(b => b.label),
        datasets: [{
          data: this.pd.bars.map(b => b.amount),
          backgroundColor: this.pd.bars.map(b =>
            b.current ? '#4C8DFF' : 'rgba(115,135,160,0.22)'
          ),
          hoverBackgroundColor: this.pd.bars.map(b =>
            b.current ? '#5A9AFF' : 'rgba(115,135,160,0.40)'
          ),
          borderRadius: 7,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 450 },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#9BA4B3', font: { size: 11 } },
          },
          y: { display: false },
        },
      },
    });
  }
}
