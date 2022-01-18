import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticationComponent } from './authentication.component';
import { AuthenticationHeaderComponent } from './authentication-header/authentication-header.component';
import {LoginComponent} from './login/login.component';
import {SharedModule} from '../shared/shared.module';
import {AUTHENTICATION_ROUTE} from './authentication.route';

@NgModule({
  declarations: [AuthenticationComponent, LoginComponent, AuthenticationHeaderComponent],
  imports: [SharedModule, RouterModule.forChild(AUTHENTICATION_ROUTE)],
  exports: [AuthenticationHeaderComponent],
})
export class AuthenticationModule {}
