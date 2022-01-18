jest.mock('@angular/router');
jest.mock('app/core/auth/account.service');

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthenticationAccessService } from 'app/authentication/authentication-access.service';
import { AccountService } from 'app/core/auth/account.service';
import * as dayjs from 'dayjs';
import { of } from 'rxjs';

describe('Service Tests', () => {
  describe('Authentication Access Service', () => {
    let service: AuthenticationAccessService;
    let mockRouter: Router;
    let mockAccountService: AccountService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [Router, AccountService, AuthenticationAccessService],
      });

      service = TestBed.inject(AuthenticationAccessService);
      mockRouter = TestBed.inject(Router);
      mockAccountService = TestBed.inject(AccountService);
    });

    describe('canActivate', () => {
      it('should return true if the user is not authenticated', () => {
        // GIVEN
        mockAccountService.identity = jest.fn(() => of(null));
        let canActivate = false;

        // WHEN
        service.canActivate().subscribe(result => (canActivate = result));

        // THEN
        expect(canActivate).toBe(true);
      });

      it('should return false and redirect to home if the user is authenticated', () => {
        // GIVEN
        mockAccountService.identity = jest.fn(() =>
          of({
            activated: true,
            roles: [],
            operations: [],
            email: '',
            firstName: '',
            langKey: '',
            lastName: '',
            uuid: '',
            birthDate: dayjs(),
          })
        );
        let canActivate = true;

        // WHEN
        service.canActivate().subscribe(result => {
          canActivate = result
          // THEN
          expect(canActivate).toBe(false);
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
        });

      });
    });
  });
});
