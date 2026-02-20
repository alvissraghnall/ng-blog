import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '@core/auth/services/user.service';
import { map } from 'rxjs/operators';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: () => {
          const userService = inject(UserService);
          const user = userService.getCurrentUserValue();
          if (user?.username) {
            return `/profile/${user.username}`;
          }
          return '/login';
        },
        pathMatch: 'full',
      },
      {
        path: ':username',
        component: ProfileComponent,
        children: [
          {
            path: '',
            loadComponent: () => import('./components/profile-articles.component'),
          },
          {
            path: 'favorites',
            loadComponent: () => import('./components/profile-favorites.component'),
          },
        ],
      },
    ],
  },
];

export default routes;
