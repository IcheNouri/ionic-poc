import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from './login.service';
import {AccountService} from '../../core/auth/account.service';
import {MypValidators} from '../../shared/validators/form-validators';

@Component({
  selector: 'myp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('email', { static: false })
  email?: ElementRef<HTMLInputElement>;

  authenticationError = false;

  loginForm = this.fb.group({
    email: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(254), MypValidators.email]],
    password: [null, [Validators.required]],
  });

  passwordHidden = true;

  constructor(private accountService: AccountService, private loginService: LoginService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    // if already authenticated then navigate to home page
    this.accountService.identity().subscribe(() => {
      if (this.accountService.isAuthenticated()) {
        this.router.navigate(['']);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.email) {
      this.email.nativeElement.focus();
    }
  }

  toggleShowPassword(): void {
    this.passwordHidden = !this.passwordHidden;
  }
}
