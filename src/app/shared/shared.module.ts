import { NgModule } from '@angular/core';

import { SharedLibsModule } from './shared-libs.module';
import { RouterModule } from '@angular/router';
import {FooterComponent} from './layouts/footer/footer.component';
import {ErrorComponent} from './layouts/error/error.component';
import {ActiveMenuDirective} from './directives/active-menu.directive';
import {PipesModule} from './pipes/pipes.module';
import {DirectivesModule} from './directives/directives.module';
import {ComponentsModule} from './components/components.module';


@NgModule({
  declarations: [FooterComponent, ErrorComponent, ActiveMenuDirective],
  imports: [SharedLibsModule, ComponentsModule, DirectivesModule, PipesModule, RouterModule],
  exports: [SharedLibsModule, ComponentsModule, DirectivesModule, PipesModule, RouterModule],
})
export class SharedModule {}
