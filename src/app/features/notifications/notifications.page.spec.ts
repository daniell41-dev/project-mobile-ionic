import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsPage } from './notifications.page';

describe('NotificationsPage', () => {
  let component: NotificationsPage;
  let fixture: ComponentFixture<NotificationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts with at least one unread notification', () => {
    expect(component.data.notifications().some(n => !n.read)).toBeTrue();
  });

  it('markAllRead marks every notification as read', () => {
    component.markAllRead();
    expect(component.data.notifications().every(n => n.read)).toBeTrue();
  });
});
