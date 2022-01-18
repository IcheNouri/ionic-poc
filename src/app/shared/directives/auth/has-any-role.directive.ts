import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {AccountService} from '../../../core/auth/account.service';


/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the roles passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *jhiHasAnyRoles="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *jhiHasAnyRoles="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
@Directive({
  selector: '[jhiHasAnyRole]',
})
export class HasAnyRoleDirective implements OnDestroy {
  private roles!: string | string[];

  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) {}

  @Input()
  set jhiHasAnyRole(value: string | string[]) {
    this.roles = value;
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
    const hasAnyRole = this.accountService.hasAnyRole(this.roles);
    this.viewContainerRef.clear();
    if (hasAnyRole) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
