import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './core/auth/services/user.service';
import { map } from 'rxjs/operators';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/article/pages/home/home.component'),
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/signin/signin.component'),
    // canActivate: [() => inject(UserService).isAuthenticated.pipe(map(isAuth => !isAuth))],
  },
  {
    path: 'post',
    loadComponent: () => import('./features/post/pages/article/article.component'),
  },
  {
    path: 'register',
    loadComponent: () => import('./core/auth/signup/signup.component'),
    // canActivate: [() => inject(UserService).isAuthenticated.pipe(map(isAuth => !isAuth))],
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component'),
    canActivate: [() => inject(UserService).isAuthenticated],
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.routes'),
  },
  {
    path: 'editor',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/post/pages/editor/editor.component'),
        canActivate: [() => inject(UserService).isAuthenticated],
      },
      {
        path: ':slug',
        loadComponent: () => import('./features/post/pages/editor/editor.component'),
        canActivate: [() => inject(UserService).isAuthenticated],
      },
    ],
  },
  {
    path: 'article/:slug',
    loadComponent: () => import('./features/post/pages/article/article.component'),
  },
  {
    path: 'oauth/:provider/callback',
    loadComponent: () => import('./core/auth/oauth-callback/oauth-callback.component'),
  },
];
