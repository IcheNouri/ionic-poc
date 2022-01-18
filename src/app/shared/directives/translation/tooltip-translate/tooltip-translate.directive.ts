import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import {AbstractTranslateDirective} from '../abstract-translate-directive';
import {translationNotFoundMessage} from '../../../config/translation.config';


@Directive({
  selector: '[mypTooltipTranslate]',
})
export class TooltipTranslateDirective extends AbstractTranslateDirective implements OnInit, OnDestroy, OnChanges {
  @Input() mypTooltipTranslate!: string;
  @Input() translateValues?: { [key: string]: unknown };
  @Input() pluralize?: string;

  constructor(private el: ElementRef, private ngbTooltip: NgbTooltip, private translateService: TranslateService) {
    super(translateService);
  }

  protected get translateKey(): string {
    return this.mypTooltipTranslate;
  }

  protected onTranslationChangeSuccess(translation: string): void {
    this.ngbTooltip.ngbTooltip = translation;
  }

  protected onTranslationChangeError(): void {
    this.ngbTooltip.ngbTooltip = `${translationNotFoundMessage}[${this.mypTooltipTranslate}]`;
  }
}
