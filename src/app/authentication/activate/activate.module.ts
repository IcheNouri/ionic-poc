import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ACTIVATE_ROUTE } from 'app/authentication/activate/activate.route';
import { AuthenticationModule } from 'app/authentication/authentication.module';
import { SharedModule } from 'app/shared/shared.module';
import { ActivateCodeComponent } from './activate-code/activate-code.component';
import { ActivateIdentityComponent } from './activate-identity/activate-identity.component';
import { ActivateEmailComponent } from './activate-email/activate-email.component';
import { ActivatePasswordComponent } from './activate-password/activate-password.component';
import { ActivateStepperComponent } from './activate-stepper/activate-stepper.component';
import { ActivateEmailMoreInfoComponent } from './activate-email/activate-email-more-info/activate-email-more-info.component';
import { ActivateContainerComponent } from './activate-container/activate-container.component';

@NgModule({
  declarations: [
    ActivateCodeComponent,
    ActivateIdentityComponent,
    ActivateEmailComponent,
    ActivatePasswordComponent,
    ActivateStepperComponent,
    ActivateEmailMoreInfoComponent,
    ActivateContainerComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(ACTIVATE_ROUTE), AuthenticationModule],
})
export class ActivateModule {}
