import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ── Pre-auth (sin tabs) ─────────────────────────────────────────────────────
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./features/auth/onboarding/onboarding.page').then(m => m.OnboardingPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.page').then(m => m.LoginPage),
  },

  // ── Stack pushes sobre la app autenticada (rutas hijas tipo push) ────────────
  {
    path: 'transactions/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/transactions/tx-detail/tx-detail.page').then(m => m.TxDetailPage),
  },
  {
    path: 'send/done',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/send/send-done/send-done.page').then(m => m.SendDonePage),
  },
  {
    path: 'send',
    canActivate: [authGuard],
    loadComponent: () => import('./features/send/send.page').then(m => m.SendPage),
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/notifications/notifications.page').then(m => m.NotificationsPage),
  },

  // ── Autenticado: tabs (protegido por authGuard) ─────────────────────────────
  // tabs.routes es dueño del segmento 'tabs'; se carga en path '' para no duplicarlo.
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes),
  },

  // ── Default ─────────────────────────────────────────────────────────────────
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
];
