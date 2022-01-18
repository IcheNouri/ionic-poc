import { Route } from '@angular/router';
import { ActivateAccessService } from 'app/authentication/activate/activate-access.service';
import { ActivateCodeComponent } from 'app/authentication/activate/activate-code/activate-code.component';
import { ActivateEmailComponent } from 'app/authentication/activate/activate-email/activate-email.component';
import { ActivateIdentityComponent } from 'app/authentication/activate/activate-identity/activate-identity.component';
import { ActivatePasswordComponent } from 'app/authentication/activate/activate-password/activate-password.component';

export const ACTIVATE_ROUTE: Route[] = [
  {
    path: '',
    canActivate: [ActivateAccessService],
    children: [
      {
        path: 'code',
        component: ActivateCodeComponent,
      },
      {
        path: 'identity',
        component: ActivateIdentityComponent,
      },
      {
        path: 'email',
        component: ActivateEmailComponent,
      },
      {
        path: 'password',
        component: ActivatePasswordComponent,
      },
    ],
  },
];
