import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Observable, of } from 'rxjs';
import {AccountService} from '../../core/auth/account.service';
import {ToastManagerService} from '../../core/services/toast-manager/toast-manager.service';
import {PopupService} from '../../core/services/popup/popup.service';
import {CategoryDto} from './category.dto';
import {CategoryService} from './category.service';

@Component({
  selector: 'myp-home-grid',
  templateUrl: './home-grid.component.html',
  styleUrls: ['./home-grid.component.scss'],
})
export class HomeGridComponent implements OnInit {
  employeePortalPopupWindow?: Window | null = null;
  isEmployeePortalPopupShown = false;
  mostUsedCategory?: CategoryDto;

  constructor(
    private accountService: AccountService,
    private toastService: ToastManagerService,
    private translateService: TranslateService,
    private popupService: PopupService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getMostUsedCategoryForCurrentUser().subscribe(response => {
      if (response.body) {
        this.mostUsedCategory = response.body;
      }
    });
  }

  getMostUsedCategoryName(): Observable<any> {
    if (!this.mostUsedCategory) {
      return this.translateService.stream('tags.pro.paycheck');
    }
    if (this.mostUsedCategory.name) {
      return of(this.mostUsedCategory.name);
    }
    return this.mostUsedCategory.translationKey ? this.translateService.stream(this.mostUsedCategory.translationKey) : of('');
  }

  filterByMostUsedCategory(): void {
    this.router.navigate(['/documents'], {
      queryParams: { categories: this.mostUsedCategory ? JSON.stringify([this.mostUsedCategory.uuid]) : undefined },
    });
  }

  openEmployeePortalPopup(): void {
    this.accountService.getEmployeePortalConnectionLink().subscribe(
      result => this.createPopupFromUrl(result.employeePortalLink),
      error => this.toastService.showHttpError(error)
    );
  }

  focusEmployeePortalModal(): void {
    this.employeePortalPopupWindow?.close();
  }

  private createPopupFromUrl(url: string): void {
    const windowTitle: string = this.translateService.instant('myPrimoboxApp.appUser.employee-portal');
    this.employeePortalPopupWindow = this.popupService.createAndCenterPopup(url, windowTitle, window.outerWidth * 0.8, window.outerHeight * 0.8);
    this.isEmployeePortalPopupShown = true;
    const interval = setInterval(() => {
      if (this.employeePortalPopupWindow?.closed) {
        this.isEmployeePortalPopupShown = false;
        this.employeePortalPopupWindow = null;
        clearInterval(interval);
      }
    }, 200);
  }
}
