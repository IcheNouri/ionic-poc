import { NgModule } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { TooltipTranslateDirective } from './translation/tooltip-translate/tooltip-translate.directive';
import {SharedLibsModule} from '../shared-libs.module';
import {HasAnyRoleDirective} from './auth/has-any-role.directive';
import {HasEveryOperationDirective} from './auth/has-every-operation.directive';
import {IsNotAdminHasEveryOperationDirective} from './auth/is-not-admin-has-every-operation.directive';
import {ButtonLoadingDirective} from './loading/button-loading.directive';
import {SortDirective} from './sort/sort.directive';
import {TranslateDirective} from './translation/translate/translate.directive';
import {SortByDirective} from './sort/sort-by.directive';

@NgModule({
  imports: [SharedLibsModule],
  providers: [NgbTooltip],
  declarations: [
    HasAnyRoleDirective,
    HasEveryOperationDirective,
    IsNotAdminHasEveryOperationDirective,
    ButtonLoadingDirective,
    SortDirective,
    SortByDirective,
    TranslateDirective,
    TooltipTranslateDirective,
  ],
  exports: [
    HasAnyRoleDirective,
    HasEveryOperationDirective,
    IsNotAdminHasEveryOperationDirective,
    ButtonLoadingDirective,
    SortDirective,
    SortByDirective,
    TranslateDirective,
    TooltipTranslateDirective,
  ],
})
export class DirectivesModule {}
