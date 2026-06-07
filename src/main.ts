import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { LOCALE_ID, inject, provideAppInitializer } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeEsMx from '@angular/common/locales/es-MX';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { AuthService } from './app/core/services/auth.service';
import { ThemeService } from './app/core/services/theme.service';

registerLocaleData(localeEsMx, 'es-MX');

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es-MX' },
    provideIonicAngular(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // Restaura sesión y tema antes del primer render para que el guard y el
    // tema reflejen el estado persistido desde el arranque.
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      const theme = inject(ThemeService);
      return Promise.all([auth.restoreSession(), theme.initialize()]);
    }),
  ],
});
