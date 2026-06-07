import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../features/home/home.page').then(m => m.HomePage),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('../features/transactions/transactions.page').then(m => m.TransactionsPage),
      },
      {
        path: 'cards',
        loadComponent: () => import('../features/cards/cards.page').then(m => m.CardsPage),
      },
      {
        path: 'stats',
        loadComponent: () => import('../features/stats/stats.page').then(m => m.StatsPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('../features/profile/profile.page').then(m => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
