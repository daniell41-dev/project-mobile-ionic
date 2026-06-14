import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProfilePage } from './profile.page';
import { ThemeService } from '../../core/services/theme.service';
import { CameraService } from '../../core/services/camera.service';

class FakeCameraService {
  result: string | null = 'data:image/png;base64,AAA';
  takeAvatarPhoto = async () => this.result;
}

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let theme: ThemeService;
  let camera: FakeCameraService;

  beforeEach(async () => {
    camera = new FakeCameraService();
    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        provideRouter([]),
        { provide: CameraService, useValue: camera },
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
});
