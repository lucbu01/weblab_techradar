import { Route } from '@angular/router';
import { Auth } from './auth/auth';

export const appRoutes: Route[] = [
  { path: '', loadComponent: () => import('./home/home').then((m) => m.Home) },
  {
    path: 'viewer',
    loadComponent: () => import('./viewer/viewer').then((m) => m.Viewer),
    canActivate: [Auth],
    data: { roles: ['CTO', 'TECHLEAD', 'EMPLOYEE'] },
  },
  {
    path: 'technologies',
    loadComponent: () =>
      import('./technologies/technologies').then((m) => m.Technologies),
    canActivate: [Auth],
    data: { roles: ['CTO', 'TECHLEAD'] },
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users').then((m) => m.Users),
    canActivate: [Auth],
    data: { roles: ['CTO'] },
  },
  { path: '**', redirectTo: '' },
];
