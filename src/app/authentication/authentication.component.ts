import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'myp-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent {
  constructor(private keycloak: KeycloakService, private router: Router) {}

  login(): void {
    history.pushState(null, '', window.location.origin);
    this.keycloak.login({
      redirectUri: window.location.origin + '/home',
      prompt: 'login',
    });
  }
}
