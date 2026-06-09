import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CardsPage } from './cards.page';

describe('CardsPage', () => {
  let component: CardsPage;
  let fixture: ComponentFixture<CardsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CardsPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes toggle state from the seed card', () => {
    const card = component.data.cards()[0];
    expect(component.frozen()).toBe(card.frozen);
    expect(component.onlinePurchases()).toBe(card.onlinePurchases);
  });

  it('toggleFrozen updates the frozen signal', () => {
    component.toggleFrozen(true);
    expect(component.frozen()).toBeTrue();
    component.toggleFrozen(false);
    expect(component.frozen()).toBeFalse();
  });

  it('toggleOnline updates the online-purchases signal', () => {
    component.toggleOnline(false);
    expect(component.onlinePurchases()).toBeFalse();
    component.toggleOnline(true);
    expect(component.onlinePurchases()).toBeTrue();
  });
});
