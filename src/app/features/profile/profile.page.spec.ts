import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { signal } from '@angular/core';
import { ProfilePage } from './profile.page';
import { ThemeService } from '../../core/services/theme.service';
import { CameraService } from '../../core/services/camera.service';
import { BiometricService } from '../../core/services/biometric.service';

class FakeCameraService {
  result: string | null = 'data:image/png;base64,AAA';
  takeAvatarPhoto = async () => this.result;
}

class FakeBiometricService {
  enabled = signal(false);
  enableResult = true;
  loadSetting = async () => { /* no-op */ };
  enable = async () => { if (this.enableResult) this.enabled.set(true); return this.enableResult; };
  disable = async () => { this.enabled.set(false); };
}

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let theme: ThemeService;
  let camera: FakeCameraService;
  let biometric: FakeBiometricService;

  beforeEach(async () => {
    camera = new FakeCameraService();
    biometric = new FakeBiometricService();
    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        provideRouter([]),
        { provide: CameraService, useValue: camera },
        { provide: BiometricService, useValue: biometric },
      ],
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

  it('changeAvatar stores the captured photo', async () => {
    expect(component.avatarPhoto()).toBeNull();
    await component.changeAvatar();
    expect(component.avatarPhoto()).toBe('data:image/png;base64,AAA');
  });

  it('changeAvatar leaves the avatar unchanged when capture is cancelled', async () => {
    camera.result = null;
    await component.changeAvatar();
    expect(component.avatarPhoto()).toBeNull();
  });

  it('toggleBiometric enables biometric lock when verification succeeds', async () => {
    biometric.enableResult = true;
    await component.toggleBiometric();
    expect(biometric.enabled()).toBeTrue();
  });

  it('toggleBiometric disables biometric lock when already enabled', async () => {
    biometric.enabled.set(true);
    await component.toggleBiometric();
    expect(biometric.enabled()).toBeFalse();
  });
});
