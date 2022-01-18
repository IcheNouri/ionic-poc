import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
//import {LoginService} from '../../../authentication/login/login.service';

@Component({
  selector: 'myp-navbar-simple',
  templateUrl: './navbar-simple.component.html',
  styleUrls: ['./navbar-simple.component.scss'],
})
export class NavbarSimpleComponent {
  @Input() firstName = '';
  @Input() lastName = '';

  isNotificationDrawerOpen = false;
  hasNewNotifications = true;

  constructor(
    //private loginService: LoginService,
    private router: Router) {}

  toggleNotificationDrawer(): void {
    this.isNotificationDrawerOpen = !this.isNotificationDrawerOpen;
  }

  getUserInitials(): string {
   /* this.firstName = 'Nouri';
    this.lastName = 'ICHE'; */
    const firstNameInitial = this.firstName ? this.firstName.charAt(0) : '';
    const lastNameInitial = this.lastName ? this.lastName.charAt(0) : '';
    return firstNameInitial.toUpperCase() + lastNameInitial.toUpperCase();
  }

  getUserName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  logout(): void {
   // this.loginService.logout();
    this.router.navigate(['']);
  }
}
