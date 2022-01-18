import { Directive, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import {AbstractSubscriptionComponent} from '../../../core/abstract-subscription.component';

@Directive()
export abstract class AbstractTranslateDirective extends AbstractSubscriptionComponent implements OnInit, OnChanges, OnDestroy {
  translateValues?: { [key: string]: unknown };
  pluralize?: string;

  protected constructor(private _translateService: TranslateService) {
    super();
  }

  protected abstract get translateKey(): string;
  protected abstract onTranslationChangeSuccess(translation: string): void;
  protected abstract onTranslationChangeError(): void;

  ngOnInit(): void {
    this._translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.onTranslationChange();
    });
  }

  ngOnChanges(): void {
    this.onTranslationChange();
  }

  protected onTranslationChange(): void {
    let key = this.translateKey;
    if (this.pluralize && this.translateValues && this.translateValues[this.pluralize] !== undefined && typeof this.translateValues[this.pluralize] === 'number') {
      const count = this.translateValues[this.pluralize] as number;
      if (count === 0) {
        key = this.translateKey + '.none';
      }
      if (Math.abs(count) === 1) {
        key = this.translateKey + '.singular';
      }
      if (Math.abs(count) > 1) {
        key = this.translateKey + '.plural';
      }
    }
    this.destroy$.next();
    this._translateService
      .get(key, this.translateValues)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        value => this.onTranslationChangeSuccess(value),
        () => this.onTranslationChangeError()
      );
  }
}
