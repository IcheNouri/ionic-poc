jest.mock('app/core/auth/account.service');

import { Component, ElementRef, ViewChild } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { HasAnyRoleDirective } from './has-any-role.directive';

@Component({
  template: ` <div *jhiHasAnyRole="'ROLE_ADMIN'" #content></div> `,
})
class TestHasAnyRoleDirectiveComponent {
  @ViewChild('content', { static: false })
  content?: ElementRef;
}

describe('HasAnyRoleDirective tests', () => {
  let mockAccountService: AccountService;
  const authenticationState = new Subject<Account | null>();

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HasAnyRoleDirective, TestHasAnyRoleDirectiveComponent],
        providers: [AccountService],
      });
    })
  );

  beforeEach(() => {
    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.getAuthenticationState = jest.fn(() => authenticationState.asObservable());
  });

  describe('set jhiHasAnyRole', () => {
    it('should show restricted content to user if user has required role', () => {
      // GIVEN
      mockAccountService.hasAnyRole = jest.fn(() => true);
      const fixture = TestBed.createComponent(TestHasAnyRoleDirectiveComponent);
      const comp = fixture.componentInstance;

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(comp.content).toBeDefined();
    });

    it('should not show restricted content to user if user has not required role', () => {
      // GIVEN
      mockAccountService.hasAnyRole = jest.fn(() => false);
      const fixture = TestBed.createComponent(TestHasAnyRoleDirectiveComponent);
      const comp = fixture.componentInstance;

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(comp.content).toBeUndefined();
    });
  });

  describe('change roles', () => {
    it('should show or not show restricted content correctly if user roles are changing', () => {
      // GIVEN
      mockAccountService.hasAnyRole = jest.fn(() => true);
      const fixture = TestBed.createComponent(TestHasAnyRoleDirectiveComponent);
      const comp = fixture.componentInstance;

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(comp.content).toBeDefined();

      // GIVEN
      mockAccountService.hasAnyRole = jest.fn(() => false);

      // WHEN
      authenticationState.next(null);
      fixture.detectChanges();

      // THEN
      expect(comp.content).toBeUndefined();

      // GIVEN
      mockAccountService.hasAnyRole = jest.fn(() => true);

      // WHEN
      authenticationState.next(null);
      fixture.detectChanges();

      // THEN
      expect(comp.content).toBeDefined();
    });
  });

  describe('ngOnDestroy', () => {
    it('should destroy authentication state subscription on component destroy', () => {
      // GIVEN
      mockAccountService.hasAnyRole = jest.fn(() => true);
      const fixture = TestBed.createComponent(TestHasAnyRoleDirectiveComponent);
      const div = fixture.debugElement.queryAllNodes(By.directive(HasAnyRoleDirective))[0];
      const hasAnyRoleDirective = div.injector.get(HasAnyRoleDirective);

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(mockAccountService.hasAnyRole).toHaveBeenCalled();

      // WHEN
      jest.clearAllMocks();
      authenticationState.next(null);

      // THEN
      expect(mockAccountService.hasAnyRole).toHaveBeenCalled();

      // WHEN
      jest.clearAllMocks();
      hasAnyRoleDirective.ngOnDestroy();
      authenticationState.next(null);

      // THEN
      expect(mockAccountService.hasAnyRole).not.toHaveBeenCalled();
    });
  });
});
