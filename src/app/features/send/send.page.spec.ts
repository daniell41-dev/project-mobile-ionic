import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SendPage } from './send.page';

describe('SendPage', () => {
  let component: SendPage;
  let fixture: ComponentFixture<SendPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SendPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts on step 1 with a zero amount', () => {
    expect(component.step()).toBe(1);
    expect(component.amount()).toBe('0');
    expect(component.amountNumber).toBe(0);
  });

  it('selecting a contact advances to step 2', () => {
    const contact = component.data.contacts()[0];
    component.selectContact(contact);
    expect(component.selectedContact()).toBe(contact);
    expect(component.step()).toBe(2);
  });

  describe('pressKey', () => {
    it('replaces the leading zero with the first digit', () => {
      component.pressKey('5');
      expect(component.amount()).toBe('5');
    });

    it('appends subsequent digits', () => {
      component.pressKey('1');
      component.pressKey('2');
      expect(component.amount()).toBe('12');
    });

    it('allows a single decimal point', () => {
      component.pressKey('5');
      component.pressKey('.');
      component.pressKey('.');
      expect(component.amount()).toBe('5.');
    });

    it('limits to two decimals', () => {
      component.pressKey('5');
      component.pressKey('.');
      component.pressKey('2');
      component.pressKey('5');
      component.pressKey('9');
      expect(component.amount()).toBe('5.25');
    });

    it('deletes the last character and floors at zero', () => {
      component.pressKey('5');
      component.pressKey('del');
      expect(component.amount()).toBe('0');
      component.pressKey('del');
      expect(component.amount()).toBe('0');
    });
  });

  describe('filteredContacts', () => {
    it('returns all contacts with an empty query', () => {
      expect(component.filteredContacts().length).toBe(component.data.contacts().length);
    });

    it('filters by name', () => {
      component.contactQuery.set('María');
      const names = component.filteredContacts().map(c => c.name);
      expect(names).toEqual(['María Torres']);
    });

    it('filters by bank, case-insensitive', () => {
      component.contactQuery.set('bbva');
      expect(component.filteredContacts().every(c => c.bank === 'BBVA')).toBeTrue();
    });

    it('returns an empty list when nothing matches', () => {
      component.contactQuery.set('zzz');
      expect(component.filteredContacts().length).toBe(0);
    });
  });
});
