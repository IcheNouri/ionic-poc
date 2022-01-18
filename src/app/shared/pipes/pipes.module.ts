import { NgModule } from '@angular/core';
import {SharedLibsModule} from '../shared-libs.module';
import {DurationPipe} from './date/duration.pipe';
import {FormatMediumDatePipe} from './date/format-medium-date.pipe';
import {FormatMediumDatetimePipe} from './date/format-medium-datetime.pipe';
import {FindLanguageFromKeyPipe} from './find-language-from-key.pipe';
import {SafePipe} from './safe.pipe';


@NgModule({
  imports: [SharedLibsModule],
  declarations: [DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe, FindLanguageFromKeyPipe, SafePipe],
  exports: [DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe, FindLanguageFromKeyPipe, SafePipe],
})
export class PipesModule {}
