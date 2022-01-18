import { Input, Directive, ElementRef, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {AbstractTranslateDirective} from '../abstract-translate-directive';
import {translationNotFoundMessage} from '../../../config/translation.config';

/**
 * A wrapper directive on top of the translate pipe as the inbuilt translate directive from ngx-translate is too verbose and buggy
 */
@Directive({
  selector: '[jhiTranslate]',
})
export class TranslateDirective extends AbstractTranslateDirective implements OnInit, OnChanges, OnDestroy {
  @Input() jhiTranslate!: string;
  @Input() translateValues?: { [key: string]: unknown };
  @Input() pluralize?: string;

  constructor(private el: ElementRef, private translateService: TranslateService) {
    super(translateService);
  }

  protected get translateKey(): string {
    return this.jhiTranslate;
  }

  protected onTranslationChangeSuccess(translation: string): void {
    this.el.nativeElement.innerHTML = translation;
  }

  protected onTranslationChangeError(): void {
    this.el.nativeElement.innerHTML = `${translationNotFoundMessage}[${this.jhiTranslate}]`;
  }
}
