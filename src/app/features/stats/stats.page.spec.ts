import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { StatsPage } from './stats.page';

// Nota: no se llama a fixture.detectChanges() para evitar ngAfterViewInit, que
// construye los charts de Chart.js sobre el <canvas> del ViewChild. Aquí se
// valida la lógica de datos por período (getters puros), no el render.
describe('StatsPage', () => {
  let component: StatsPage;
  let fixture: ComponentFixture<StatsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defaults to the month period', () => {
    expect(component.period()).toBe('month');
    expect(component.pd.label).toBe('Junio');
  });

  it('totalSpent is the sum of the period categories', () => {
    component.period.set('month');
    const expected = component.pd.categories.reduce((s, c) => s + c.amount, 0);
    expect(component.totalSpent).toBe(expected);
  });

  it('switches the dataset when the period changes', () => {
    component.period.set('week');
    expect(component.pd.label).toBe('Esta semana');

    component.period.set('year');
    expect(component.pd.label).toBe('2025');
    expect(component.pd.trendPositive).toBeTrue();
  });
});
