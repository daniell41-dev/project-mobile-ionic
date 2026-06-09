import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { StorageService } from './storage.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let storage: StorageService;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    storage = TestBed.inject(StorageService);
    await storage.clear();
    service = TestBed.inject(ThemeService);
  });

  afterEach(async () => {
    await storage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('defaults to dark mode', () => {
    expect(service.theme()).toBe('dark');
    expect(service.isDark()).toBeTrue();
  });

  it('setTheme applies the matching class on <html>', () => {
    service.setTheme('light');
    expect(service.isDark()).toBeFalse();
    expect(document.documentElement.classList.contains('light')).toBeTrue();
    expect(document.documentElement.classList.contains('dark')).toBeFalse();

    service.setTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBeTrue();
    expect(document.documentElement.classList.contains('light')).toBeFalse();
  });

  it('toggle flips between dark and light', () => {
    service.setTheme('dark');
    service.toggle();
    expect(service.theme()).toBe('light');
    service.toggle();
    expect(service.theme()).toBe('dark');
  });

  it('initialize restores a persisted theme', async () => {
    await storage.set('nimbo-theme', 'light');
    await service.initialize();
    expect(service.theme()).toBe('light');
  });
});
