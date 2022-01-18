import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  ActivateEmailMoreInfoComponent
} from 'app/authentication/activate/activate-email/activate-email-more-info/activate-email-more-info.component';
import {ActivateService} from 'app/authentication/activate/activate.service';
import {ActivateAccountDto} from 'app/authentication/activate/dto/activate-account.dto';
import {LoadingManager} from 'app/shared/directives/loading/loading-manager';
import {ToastManagerService} from 'app/core/services/toast-manager/toast-manager.service';
import {MypValidators} from 'app/shared/validators/form-validators';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'myp-activate-email',
  templateUrl: './activate-email.component.html',
  styleUrls: ['./activate-email.component.scss'],
})
export class ActivateEmailComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('email') emailInput?: ElementRef<HTMLInputElement>;

  form = this.fb.group({
    email: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(254), MypValidators.email]],
  });

  loadingManager = new LoadingManager();

  private destroy$ = new Subject<void>();

  constructor(private activateService: ActivateService, private fb: FormBuilder, private toastService: ToastManagerService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.activateService
      .getFormValues()
      .pipe(takeUntil(this.destroy$))
      .subscribe(formValues => this.patchForm(formValues));
  }

  ngAfterViewInit(): void {
    if (this.emailInput) {
      this.emailInput.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitEmail(): void {
    this.loadingManager.start();
    this.activateService.verifyEmail(this.form.get('email')?.value).subscribe(
      () => this.loadingManager.stop(),
      err => {
        this.toastService.showHttpError(err);
        this.loadingManager.stop();
      }
    );
  }

  back(): void {
    this.activateService.goBack();
  }

  openMoreInfoModal(): void {
    this.modalService.open(ActivateEmailMoreInfoComponent, {
      size: 'lg',
      centered: true,
    });
  }

  private patchForm(formValues: ActivateAccountDto | null): void {
    if (formValues) {
      const email = formValues.email && formValues.email.length > 0 ? formValues.email : null;
      this.form.get('email')?.patchValue(email);
    }
  }
}
