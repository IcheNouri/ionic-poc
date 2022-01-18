import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { ApplicationConfigService } from '../config/application-config.service';
import { KeycloakService } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  constructor(
    private http: HttpClient,
    private $localStorage: LocalStorageService,
    private $sessionStorage: SessionStorageService,
    private applicationConfigService: ApplicationConfigService,
    private keycloak: KeycloakService
  ) {}

  getToken(): string {
    const tokenInLocalStorage: string | null = this.$localStorage.retrieve('authenticationToken');
    const tokenInSessionStorage: string | null = this.$sessionStorage.retrieve('authenticationToken');
    return tokenInLocalStorage ?? tokenInSessionStorage ?? '';
  }

  logout(): Observable<void> {
    return new Observable(observer => {
      this.$localStorage.clear('authenticationToken');
      this.$sessionStorage.clear('authenticationToken');
      this.keycloak.logout(window.location.origin);
      observer.complete();
    });
  }
}
