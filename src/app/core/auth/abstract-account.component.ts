import { Directive, OnDestroy, OnInit } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import {AbstractSubscriptionComponent} from '../abstract-subscription.component';
import {Account} from './account.model';
import {AccountService} from './account.service';

@Directive()
export abstract class AbstractAccountComponent extends AbstractSubscriptionComponent implements OnInit, OnDestroy {
  protected account: Account | null = null;

  protected constructor(private _accountService: AccountService) {
    super();
  }

  ngOnInit(): void {
    this._accountService
      .identity()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }
}
