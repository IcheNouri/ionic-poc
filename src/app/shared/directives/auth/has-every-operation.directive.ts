import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {AccountService} from '../../../core/auth/account.service';


@Directive({
  selector: '[jhiHasEveryOperation]',
})
export class HasEveryOperationDirective implements OnDestroy {
  private operations!: string | string[];

  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) {}

  @Input()
  set jhiHasEveryOperation(value: string | string[]) {
    this.operations = value;
    this.updateView();
    // Get notified each time authentication state changes.
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateView();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    const hasEveryOperation = this.accountService.hasEveryOperation(this.operations);
    this.viewContainerRef.clear();
    if (hasEveryOperation) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
