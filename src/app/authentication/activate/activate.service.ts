import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActivateStep } from 'app/authentication/activate/activate-step.enum';
import { ActivateAccountDto } from 'app/authentication/activate/dto/activate-account.dto';
import { VerifyPasswordDto } from 'app/authentication/activate/dto/verify-password.dto';
import { Account } from 'app/core/auth/account.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Dayjs } from 'dayjs';
import { SessionStorageService } from 'ngx-webstorage';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

export interface Identity {
  firstName: string;
  lastName: string;
  birthDate: Dayjs;
}

@Injectable({
  providedIn: 'root',
})
export class ActivateService {
  private currentStep$ = new BehaviorSubject<ActivateStep>(ActivateStep.CODE);
  private userAccount$ = new BehaviorSubject<Account | null>(null);
  private formValues$ = new BehaviorSubject<ActivateAccountDto | null>(null);
  private isLandingOnIdentityStep$ = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private router: Router,
    private sessionStorage: SessionStorageService,
    private translateService: TranslateService
  ) {}

  getCurrentStep(): Observable<ActivateStep> {
    return this.currentStep$.asObservable();
  }

  getUserAccount(): Observable<Account | null> {
    return this.userAccount$.asObservable();
  }

  getFormValues(): Observable<ActivateAccountDto | null> {
    return this.formValues$.asObservable();
  }

  isLandingOnIdentityStep(): Observable<boolean> {
    return this.isLandingOnIdentityStep$.asObservable();
  }

  reset(): void {
    this.currentStep$.next(ActivateStep.CODE);
    this.userAccount$.next(null);
    this.formValues$.next(null);
    this.isLandingOnIdentityStep$.next(false);
  }

  verifyCode(code: string, isLandingOnIdentityStep: boolean): Observable<Account> {
    return this.httpClient
      .get<Account>(this.applicationConfigService.getEndpointFor('api/activation/verify/key') + '/' + code)
      .pipe(tap(account => this.onCodeVerificationSuccess(account, code, isLandingOnIdentityStep)));
  }

  verifyIdentity(identity: Identity): Observable<void> {
    return this.httpClient
      .post<void>(this.applicationConfigService.getEndpointFor('api/activation/verify/identity'), {
        firstName: identity.firstName,
        lastName: identity.lastName,
        birthDate: identity.birthDate,
        activationKey: this.formValues$.value?.activationKey,
      })
      .pipe(tap(() => this.onIdentityVerificationSuccess(identity)));
  }

  verifyEmail(email: string): Observable<void> {
    return this.httpClient
      .post<void>(this.applicationConfigService.getEndpointFor('api/activation/verify/email'), {
        email,
        activationKey: this.formValues$.value?.activationKey,
      })
      .pipe(tap(() => this.onEmailVerificationSuccess(email)));
  }

  verifyPassword(password: string): Observable<boolean> {
    const passwordDto: VerifyPasswordDto = {
      password,
      firstName: this.formValues$.value?.firstName,
      lastName: this.formValues$.value?.lastName,
      birthDate: this.formValues$.value?.birthDate,
      email: this.formValues$.value?.email,
    };
    return this.httpClient.post<void>(this.applicationConfigService.getEndpointFor('api/activation/verify/password'), passwordDto).pipe(
      switchMap(() => this.activateAccount(password)),
      switchMap(() => this.router.navigateByUrl('/'))
    );
  }

  goBack(): void {
    switch (this.currentStep$.value) {
      case ActivateStep.IDENTITY:
        this.currentStep$.next(ActivateStep.CODE);
        break;
      case ActivateStep.EMAIL:
        this.currentStep$.next(ActivateStep.IDENTITY);
        break;
      case ActivateStep.PASSWORD:
        this.currentStep$.next(ActivateStep.EMAIL);
        break;
      default:
        break;
    }
  }

  private onCodeVerificationSuccess(account: Account, code: string, isLandingOnIdentityStep: boolean): void {
    this.userAccount$.next(account);
    this.formValues$.next({ activationKey: code });
    this.currentStep$.next(ActivateStep.IDENTITY);
    this.isLandingOnIdentityStep$.next(isLandingOnIdentityStep);

    if (account.langKey) {
      this.sessionStorage.store('locale', account.langKey);
      this.translateService.use(account.langKey);
    }

    if (!isLandingOnIdentityStep) {
      this.router.navigateByUrl('/activate/identity');
    }
  }

  private onIdentityVerificationSuccess(identity: Identity): void {
    const formValues = this.formValues$.value;
    if (formValues) {
      formValues.firstName = identity.firstName;
      formValues.lastName = identity.lastName;
      formValues.birthDate = identity.birthDate;
      this.formValues$.next(formValues);
      this.currentStep$.next(ActivateStep.EMAIL);
    }
    this.router.navigateByUrl('/activate/email');
  }

  private onEmailVerificationSuccess(email: string): void {
    const formValues = this.formValues$.value;
    if (formValues) {
      formValues.email = email;
      this.formValues$.next(formValues);
      this.currentStep$.next(ActivateStep.PASSWORD);
    }
    this.router.navigateByUrl('/activate/password');
  }

  private activateAccount(password: string): Observable<Account> {
    return this.httpClient.post<Account>(this.applicationConfigService.getEndpointFor('api/activation/activate'), {
      activationKey: this.formValues$.value?.activationKey,
      firstName: this.formValues$.value?.firstName,
      lastName: this.formValues$.value?.lastName,
      birthDate: this.formValues$.value?.birthDate,
      email: this.formValues$.value?.email,
      password,
    });
  }
}
