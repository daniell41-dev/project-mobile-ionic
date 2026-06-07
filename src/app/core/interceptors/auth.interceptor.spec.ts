import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

class FakeAuthService {
  token: string | null = null;
  getToken = () => this.token;
}

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let auth: FakeAuthService;

  beforeEach(() => {
    auth = new FakeAuthService();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: auth },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('adds the Authorization header when a token exists', () => {
    auth.token = 'abc123';
    http.get('/data').subscribe();

    const req = httpMock.expectOne('/data');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    req.flush({});
  });

  it('does not add the header when there is no token', () => {
    auth.token = null;
    http.get('/data').subscribe();

    const req = httpMock.expectOne('/data');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
