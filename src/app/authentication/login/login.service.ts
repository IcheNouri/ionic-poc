import { Injectable } from '@angular/core';

import {AccountService} from '../../core/auth/account.service';
import {AuthServerProvider} from '../../core/auth/auth-jwt.service';

//@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private accountService: AccountService, private authServerProvider: AuthServerProvider) {}

  logout(): void {
    this.authServerProvider.logout().subscribe({ complete: () => this.accountService.authenticate(null) });
  }
}
