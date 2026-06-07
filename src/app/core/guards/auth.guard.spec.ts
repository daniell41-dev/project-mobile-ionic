import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

class FakeAuthService {
  authenticated = false;
  isAuthenticated = () => this.authenticated;
}

describe('authGuard', () => {
  let auth: FakeAuthService;

  beforeEach(() => {
    auth = new FakeAuthService();
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: auth }],
    });
  });

  function run() {
    // Los guards funcionales se ejecutan dentro del contexto de inyección.
    return TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
  }

  it('allows activation when authenticated', () => {
    auth.authenticated = true;
    expect(run()).toBeTrue();
  });

  it('redirects to /onboarding when not authenticated', () => {
    auth.authenticated = false;
    const result = run();
    expect(result instanceof UrlTree).toBeTrue();

    const expected = TestBed.inject(Router).createUrlTree(['/onboarding']);
    expect((result as UrlTree).toString()).toBe(expected.toString());
  });
});
