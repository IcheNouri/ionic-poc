import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OverlayComponent } from './overlay/overlay.component';
import { SideDrawerComponent } from './drawers/side-drawer/side-drawer.component';
import { ModalHeaderComponent } from './modals/modal-header/modal-header.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import {PasswordStrengthComponent} from './password/password-strength/password-strength.component';
import {PasswordFormComponent} from './password/password-form/password-form.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {SharedLibsModule} from '../shared-libs.module';
import {JhipsterComponentsModule} from './jhipster-components/jhipster-components.module';
import {DirectivesModule} from '../directives/directives.module';
import {BottomDrawerComponent} from './drawers/bottom-drawer/bottom-drawer.component';

@NgModule({
  imports: [SharedLibsModule, JhipsterComponentsModule, DirectivesModule, RouterModule],
  declarations: [
    SpinnerComponent,
    PasswordFormComponent,
    PasswordStrengthComponent,
    OverlayComponent,
    SideDrawerComponent,
    BottomDrawerComponent,
    ModalHeaderComponent,
    UploadDocumentComponent,
  ],
  exports: [
    JhipsterComponentsModule,
    SpinnerComponent,
    PasswordFormComponent,
    PasswordStrengthComponent,
    OverlayComponent,
    SideDrawerComponent,
    BottomDrawerComponent,
    ModalHeaderComponent,
    UploadDocumentComponent,
  ],
})
export class ComponentsModule {}
