import { Route } from '@angular/router';
import { AuthenticationAccessService } from 'app/authentication/authentication-access.service';
import { LoginComponent } from 'app/authentication/login/login.component';
import { AuthenticationComponent } from './authentication.component';

export const AUTHENTICATION_ROUTE: Route[] = [
  {
    path: '',
    canActivate: [AuthenticationAccessService],
    children: [
      {
        path: '',
        component: AuthenticationComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'activate',
        loadChildren: () => import('./activate/activate.module').then(m => m.ActivateModule),
      },
    ],
  },
];
