import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StateStorageService } from './state-storage.service';
import {AccountService} from './account.service';
import {KeycloakService} from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class UserRouteAccessService {
  constructor(protected router: Router, private accountService: AccountService, private stateStorageService: StateStorageService, protected keycloak: KeycloakService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.identity().pipe(
      map(account => {
        if (account) {
          const roles = route.data.roles;

          if (!roles || roles.length === 0 || this.accountService.hasAnyRole(roles)) {
            return true;
          }

          if (isDevMode()) {
            console.error('User has not any of required roles: ', roles);
          }
          this.router.navigate(['accessdenied']);
          return false;
        } else {
          this.keycloak.login({
            redirectUri: window.location.origin + state.url,
          });
        }

        return false;
      })
    );
  }
}
