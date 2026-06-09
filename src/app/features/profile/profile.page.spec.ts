import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProfilePage } from './profile.page';
import { ThemeService } from '../../core/services/theme.service';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let theme: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    theme = TestBed.inject(ThemeService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggleTheme(true) sets dark mode', () => {
    component.toggleTheme(true);
    expect(theme.isDark()).toBeTrue();
  });

  it('toggleTheme(false) sets light mode', () => {
    component.toggleTheme(false);
    expect(theme.isDark()).toBeFalse();
  });

  it('exposes the current user for the header', () => {
    expect(component.data.user().name).toBe('Andrea Salas');
  });
});
