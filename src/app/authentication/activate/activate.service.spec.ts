import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActivateStep } from 'app/authentication/activate/activate-step.enum';
import { ActivateService, Identity } from 'app/authentication/activate/activate.service';
import { ActivateAccountDto } from 'app/authentication/activate/dto/activate-account.dto';
import { Operation } from 'app/shared/config/operation.constants';
import { Role } from 'app/shared/config/role.constants';
import { Account } from 'app/core/auth/account.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { SessionStorageService } from 'ngx-webstorage';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

jest.mock('@angular/router');
jest.mock('@ngx-translate/core');
jest.mock('ngx-webstorage');
jest.mock('app/core/config/application-config.service');

export function createTestAccount(): Account {
  return {
    activated: false,
    roles: [Role.USER],
    operations: [Operation.DOWNLOAD_MY_DOCUMENT],
    email: 'test@mail.com',
    firstName: 'chuck',
    langKey: 'fr',
    lastName: 'testa',
    uuid: '7e823636-757f-4e2f-8353-a138458d693c',
    birthDate: dayjs(),
  };
}

function createTestIdentity(): Identity {
  return {
    firstName: 'bozzo',
    lastName: 'chucky',
    birthDate: dayjs(),
  };
}

function expectDatesToBeEqual(expected: Dayjs | null | undefined, actual: Dayjs | null | undefined): void {
  if (actual) {
    expect(expected?.isSame(actual)).toBe(true);
  } else {
    expect(expected).toEqual(actual);
  }
}

function expectAccountsToBeEqual(expected: Account | null, actual: Account | null): void {
  expect(expected?.activated).toEqual(actual?.activated);
  expect(expected?.roles).toEqual(actual?.roles);
  expect(expected?.operations).toEqual(actual?.operations);
  expect(expected?.email).toEqual(actual?.email);
  expect(expected?.firstName).toEqual(actual?.firstName);
  expect(expected?.langKey).toEqual(actual?.langKey);
  expect(expected?.lastName).toEqual(actual?.lastName);
  expect(expected?.uuid).toEqual(actual?.uuid);
  expectDatesToBeEqual(expected?.birthDate, actual?.birthDate);
}

function mockGetEndpointFor(endpoint: string): string {
  switch (endpoint) {
    case 'api/activation/verify/key':
      return 'key';
    case 'api/activation/verify/identity':
      return 'identity';
    case 'api/activation/verify/email':
      return 'email';
    case 'api/activation/verify/password':
      return 'password';
    case 'api/activation/activate':
      return 'activate';
    default:
      return 'mock : invalid endpoint parameter';
  }
}

describe('Service Tests', () => {
  describe('Activate Service', () => {
    let service: ActivateService;
    let httpMock: HttpTestingController;
    let mockApplicationConfigService: ApplicationConfigService;
    let mockRouter: Router;
    let mockSessionStorage: SessionStorageService;
    let mockTranslateService: TranslateService;
    let currentStep: ActivateStep | null = null;
    let currentAccount: Account | null = null;
    let formValues: ActivateAccountDto | null = null;
    const unsubscribe$ = new Subject<void>();

    const router = { navigateByUrl: () => Promise.resolve(true) };
    const translateService = { use: jest.fn() };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          ApplicationConfigService,
          { provide: Router, useValue: router },
          SessionStorageService,
          { provide: TranslateService, useValue: translateService },
        ],
      });

      service = TestBed.inject(ActivateService);
      httpMock = TestBed.inject(HttpTestingController);
      mockApplicationConfigService = TestBed.inject(ApplicationConfigService);
      mockRouter = TestBed.inject(Router);
      mockSessionStorage = TestBed.inject(SessionStorageService);
      mockTranslateService = TestBed.inject(TranslateService);
      mockApplicationConfigService.getEndpointFor = jest.fn(mockGetEndpointFor);

      service
        .getCurrentStep()
        .pipe(takeUntil(unsubscribe$))
        .subscribe(step => (currentStep = step));
      service
        .getUserAccount()
        .pipe(takeUntil(unsubscribe$))
        .subscribe(acc => (currentAccount = acc));
      service
        .getFormValues()
        .pipe(takeUntil(unsubscribe$))
        .subscribe(fm => (formValues = fm));
    });

    afterEach(() => {
      httpMock.verify();
      unsubscribe$.next();
    });

    describe('verifyCode', () => {
      it('should make a call to the verification API and do nothing in case of error', done => {
        // GIVEN

        // WHEN
        service.verifyCode('ABCDEFGH', false).subscribe(
          () => {
            fail();
          },
          () => {
            expect(currentStep).toBe(ActivateStep.CODE);
            expect(mockSessionStorage.store).toHaveBeenCalledTimes(0);
            expect(mockTranslateService.use).toHaveBeenCalledTimes(0);
            done();
          }
        );

        // THEN
        httpMock.expectOne({ method: 'GET', url: 'key/ABCDEFGH' }).flush({}, { status: 400, statusText: 'Bad Request' });
      });

      it('should update user account and language and go to next step on success', done => {
        // GIVEN
        const account: Account = createTestAccount();

        // WHEN
        service.verifyCode('ABCDEFGH', false).subscribe(
          () => {
            expect(currentStep).toBe(ActivateStep.IDENTITY);
            expect(formValues?.activationKey).toEqual('ABCDEFGH');
            expectAccountsToBeEqual(account, currentAccount);
            expect(mockSessionStorage.store).toHaveBeenCalledWith('locale', account.langKey);
            expect(mockTranslateService.use).toHaveBeenCalledWith(account.langKey);
            done();
          },
          () => {
            fail();
          }
        );

        // THEN
        httpMock.expectOne({ method: 'GET', url: 'key/ABCDEFGH' }).flush(account);
      });
    });

    describe('verifyIdentity', () => {
      it('should make a call to the verification API and do nothing in case of error', done => {
        // GIVEN
        const identity = createTestIdentity();
        const expectedAccount = createTestAccount();
        service.verifyCode('ABCDEFGH', false).subscribe();
        httpMock.expectOne({ method: 'GET', url: 'key/ABCDEFGH' }).flush(expectedAccount);

        // WHEN
        service.verifyIdentity(identity).subscribe(
          () => {
            fail();
          },
          () => {
            expect(currentStep).toBe(ActivateStep.IDENTITY);
            expect(formValues?.activationKey).toEqual('ABCDEFGH');
            done();
          }
        );

        // THEN
        httpMock.expectOne({ method: 'POST', url: 'identity' }).flush({}, { status: 400, statusText: 'Bad Request' });
      });

      it('should update user account and go to next step on success', done => {
        // GIVEN
        const identity = createTestIdentity();
        const expectedAccount = createTestAccount();
        expectedAccount.firstName = identity.firstName;
        expectedAccount.lastName = identity.lastName;
        expectedAccount.birthDate = identity.birthDate;
        service.verifyCode('ABCDEFGH', false).subscribe();
        httpMock.expectOne({ method: 'GET', url: 'key/ABCDEFGH' }).flush(createTestAccount());

        // WHEN
        service.verifyIdentity(identity).subscribe(
          () => {
            expect(currentStep).toBe(ActivateStep.EMAIL);
            expect(formValues?.firstName).toEqual(identity.firstName);
            expect(formValues?.lastName).toEqual(identity.lastName);
            expectDatesToBeEqual(expectedAccount.birthDate, identity.birthDate);
            done();
          },
          () => {
            fail();
          }
        );

        // THEN
        httpMock.expectOne({ method: 'POST', url: 'identity' }).flush({});
      });
    });

    describe('verifyEmail', () => {
      it('should make a call to the verification API and do nothing in case of error', done => {
        // GIVEN
        const identity = createTestIdentity();
        const expectedAccount = createTestAccount();
        const email = 'newMail@mail.com';
        expectedAccount.firstName = identity.firstName;
        expectedAccount.lastName = identity.lastName;
        expectedAccount.birthDate = identity.birthDate;
        service.verifyCode('ABCDEFGH', false).subscribe();
        httpMock.expectOne({ method: 'GET', url: 'key/ABCDEFGH' }).flush(createTestAccount());
        service.verifyIdentity(identity).subscribe();
        httpMock.expectOne({ method: 'POST', url: 'identity' }).flush({});

        // WHEN
        service.verifyEmail(email).subscribe(
          () => {
            fail();
          },
          () => {
            expect(currentStep).toBe(ActivateStep.EMAIL);
            expect(formValues?.email).toBeUndefined();
            done();
          }
        );

        // THEN
        httpMock.expectOne({ method: 'POST', url: 'email' }).flush({}, { status: 400, statusText: 'Bad Request' });
      });

      it('should update user account and go to next step on success', done => {
        // GIVEN
        const identity = createTestIdentity();
        const expectedAccount = createTestAccount();
        const email = 'newMail@mail.com';
        expectedAccount.firstName = identity.firstName;
        expectedAccount.lastName = identity.lastName;
        expectedAccount.birthDate = identity.birthDate;
        expectedAccount.email = email;
        service.verifyCode('ABCDEFGH', false).subscribe();
        httpMock.expectOne({ method: 'GET', url: 'key/ABCDEFGH' }).flush(createTestAccount());
        service.verifyIdentity(identity).subscribe();
        httpMock.expectOne({ method: 'POST', url: 'identity' }).flush({});

        // WHEN
        service.verifyEmail(email).subscribe(
          () => {
            expect(currentStep).toBe(ActivateStep.PASSWORD);
            expect(formValues?.email).toEqual(expectedAccount.email);
            done();
          },
          () => {
            fail();
          }
        );

        // THEN
        httpMock.expectOne({ method: 'POST', url: 'email' }).flush({});
      });
    });

    describe('verifyPassword', () => {
      it('should make a call to the verification API and do nothing in case of error', done => {
        // GIVEN
        const identity = createTestIdentity();
        const email = 'newMail@mail.com';
        const password = 'password';
        service.verifyCode('ABCDEFGH', false).subscribe();
        httpMock.expectOne({ method: 'GET', url: 'key/ABCDEFGH' }).flush(createTestAccount());
        service.verifyIdentity(identity).subscribe();
        httpMock.expectOne({ method: 'POST', url: 'identity' }).flush({});
        service.verifyEmail(email).subscribe();
        httpMock.expectOne({ method: 'POST', url: 'email' }).flush({});

        // WHEN
        service.verifyPassword(password).subscribe(
          () => {
            fail();
          },
          () => {
            expect(currentStep).toBe(ActivateStep.PASSWORD);
            done();
          }
        );

        // THEN
        httpMock.expectOne({ method: 'POST', url: 'password' }).flush({}, { status: 400, statusText: 'Bad Request' });
      });

      it('should call account activation on success and redirect to the login page', done => {
        // GIVEN
        const identity = createTestIdentity();
        const account = createTestAccount();
        const email = 'newMail@mail.com';
        const password = 'password';
        mockRouter.navigateByUrl = jest.fn(() => Promise.resolve(true));
        service.verifyCode('ABCDEFGH', false).subscribe();
        httpMock.expectOne({ method: 'GET', url: 'key/ABCDEFGH' }).flush(account);
        service.verifyIdentity(identity).subscribe();
        httpMock.expectOne({ method: 'POST', url: 'identity' }).flush({});
        service.verifyEmail(email).subscribe();
        httpMock.expectOne({ method: 'POST', url: 'email' }).flush({});

        // WHEN
        service.verifyPassword(password).subscribe(
          () => {
            expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
            done();
          },
          () => {
            fail();
          }
        );

        // THEN
        httpMock.expectOne({ method: 'POST', url: 'password' }).flush({});
        httpMock.expectOne({ method: 'POST', url: 'activate' }).flush(account);
      });
    });

    describe('goBack', () => {
      it('should go to the previous step', () => {
        // GIVEN
        service.verifyCode('ABCDEFGH', false).subscribe();
        httpMock.expectOne({ method: 'GET', url: 'key/ABCDEFGH' }).flush(createTestAccount());
        service.verifyIdentity(createTestIdentity()).subscribe();
        httpMock.expectOne({ method: 'POST', url: 'identity' }).flush({});
        service.verifyEmail('test@mail.com').subscribe();
        httpMock.expectOne({ method: 'POST', url: 'email' }).flush({});

        // WHEN
        expect(currentStep).toBe(ActivateStep.PASSWORD);
        service.goBack();
        expect(currentStep).toBe(ActivateStep.EMAIL);
        service.goBack();
        expect(currentStep).toBe(ActivateStep.IDENTITY);
        service.goBack();
        expect(currentStep).toBe(ActivateStep.CODE);
      });
    });
  });
});
