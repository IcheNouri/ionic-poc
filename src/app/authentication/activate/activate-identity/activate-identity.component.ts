import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ActivateService, Identity} from 'app/authentication/activate/activate.service';
import {ActivateAccountDto} from 'app/authentication/activate/dto/activate-account.dto';
import {LoadingManager} from 'app/shared/directives/loading/loading-manager';
import {ToastManagerService} from 'app/core/services/toast-manager/toast-manager.service';
import {MypValidators} from 'app/shared/validators/form-validators';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'myp-activate-identity',
  templateUrl: './activate-identity.component.html',
  styleUrls: ['./activate-identity.component.scss'],
})
export class ActivateIdentityComponent implements OnInit, AfterViewInit, OnDestroy {
  public readonly BIRTH_DATE_FORMAT = 'dd/MM/yyyy';

  @ViewChild('lastname') lastnameInput?: ElementRef<HTMLInputElement>;

  form = this.fb.group({
    lastname: [null, [Validators.required, Validators.maxLength(50)]],
    firstname: [null, [Validators.required, Validators.maxLength(50)]],
    birthdate: [null, [Validators.required, MypValidators.dateFormat(this.BIRTH_DATE_FORMAT)]],
  });

  activateCodeLoadingManager = new LoadingManager();
  loadingManager = new LoadingManager();

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private activateService: ActivateService, private route: ActivatedRoute, private toastService: ToastManagerService) {
    dayjs.extend(utc);
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => this.onActivationCodeUpdate(params.get('key')));
    this.activateService
      .getFormValues()
      .pipe(takeUntil(this.destroy$))
      .subscribe(formValues => this.patchForm(formValues));
  }

  ngAfterViewInit(): void {
    if (this.lastnameInput) {
      this.lastnameInput.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitIdentity(): void {
    this.loadingManager.start();
    this.activateService.verifyIdentity(this.createIdentity()).subscribe(
      () => this.loadingManager.stop(),
      err => {
        console.error(err);
        this.toastService.showHttpError(err);
        this.loadingManager.stop();
      }
    );
  }

  private onActivationCodeUpdate(activationCode: string | null): void {
    if (activationCode != null) {
      this.activateCodeLoadingManager.start();
      this.activateService.verifyCode(activationCode, true).subscribe(
        () => {
          this.activateCodeLoadingManager.stop();
        },
        err => {
          console.error(err);
          this.toastService.showHttpError(err);
          this.activateCodeLoadingManager.stop();
        }
      );
    }
  }

  private createIdentity(): Identity {
    return {
      firstName: this.form.get('firstname')?.value,
      lastName: this.form.get('lastname')?.value,
      birthDate: dayjs.utc(this.form.get('birthdate')?.value).utc(),
    };
  }

  private patchForm(formValues: ActivateAccountDto | null): void {
    if (formValues) {
      const lastname = formValues.lastName && formValues.lastName.length > 0 ? formValues.lastName : null;
      this.form.get('lastname')?.patchValue(lastname);
      const firstname = formValues.firstName && formValues.firstName.length > 0 ? formValues.firstName : null;
      this.form.get('firstname')?.patchValue(firstname);
      const birthdate = formValues.birthDate ? dayjs.utc(formValues.birthDate).format('YYYY-MM-DD') : null;
      this.form.get('birthdate')?.patchValue(birthdate);
    }
  }

  back(): void {
    this.activateService.goBack();
  }
}
