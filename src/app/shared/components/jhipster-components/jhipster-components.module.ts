import { NgModule } from '@angular/core';
import {SharedLibsModule} from '../../shared-libs.module';
import {DirectivesModule} from '../../directives/directives.module';
import {ItemCountComponent} from './pagination/item-count.component';


@NgModule({
  imports: [SharedLibsModule, DirectivesModule],
  declarations: [ItemCountComponent],
  exports: [ItemCountComponent],
})
export class JhipsterComponentsModule {}
