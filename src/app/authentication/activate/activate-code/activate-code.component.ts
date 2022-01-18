import {Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivateService} from 'app/authentication/activate/activate.service';
import {ActivateAccountDto} from 'app/authentication/activate/dto/activate-account.dto';
import {LoadingManager} from 'app/shared/directives/loading/loading-manager';
import {ToastManagerService} from 'app/core/services/toast-manager/toast-manager.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'myp-activate-code',
  templateUrl: './activate-code.component.html',
  styleUrls: ['./activate-code.component.scss'],
})
export class ActivateCodeComponent implements OnInit, OnDestroy {
  @ViewChildren('inputs')
  inputs?: QueryList<ElementRef<HTMLInputElement>>;

  @ViewChild('submit', { static: false })
  submitButton?: ElementRef<HTMLButtonElement>;

  form = this.fb.group({
    code: this.fb.array([]),
  });

  loadingManager = new LoadingManager();

  private readonly ACTIVATION_CODE_REGEXP = /^[a-z0-9]+$/i;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private activateService: ActivateService, private toastService: ToastManagerService) {
    this.pushEmptyFormControls();
  }

  ngOnInit(): void {
    this.activateService
      .getFormValues()
      .pipe(takeUntil(this.destroy$))
      .subscribe(formValues => this.patchForm(formValues));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFormControl(formControlIndex: number): FormControl {
    return (this.form.get('code') as FormArray).at(formControlIndex) as FormControl;
  }

  submitCode(): void {
    const code = ((this.form.get('code') as FormArray).getRawValue() as string[]).reduce((previousValue, currentValue) => previousValue + currentValue.toUpperCase(), '');
    this.loadingManager.start();
    this.activateService.verifyCode(code, false).subscribe(
      () => this.loadingManager.stop(),
      err => {
        console.error(err);
        this.toastService.showHttpError(err);
        this.loadingManager.stop();
      }
    );
  }

  focusNextElementIfValid(formControlIndex: number): void {
    const formControl = this.getFormControl(formControlIndex);
    if (formControl.valid) {
      if (formControlIndex === 0) {
        this.focusElement(this.inputs?.get(formControlIndex + 1));
      } else {
        this.focusElement(this.submitButton);
      }
    }
  }

  setValueToUppercase(formControlIndex: number): void {
    const elementRef = this.inputs?.get(formControlIndex);
    if (elementRef) {
      elementRef.nativeElement.value = elementRef.nativeElement.value.toUpperCase();
    }
  }

  deletePreviousCharacterIfEmpty(): void {
    const part1 = this.inputs?.get(0);
    const part2 = this.inputs?.get(1);
    if (part1 && part2 && part2.nativeElement.value.length === 0) {
      if (part1.nativeElement.value.length > 0) {
        part1.nativeElement.value = part1.nativeElement.value.substring(0, part1.nativeElement.value.length - 1);
      }
      this.focusElement(part1);
    }
  }

  pasteOverflowCharactersToNextInputs($event: ClipboardEvent): void {
    const pastedCode = $event.clipboardData?.getData('text') ?? ((window as any).clipboardData as string);
    if (pastedCode.length > 4) {
      (this.form.get('code') as FormArray).at(1).patchValue(pastedCode.substring(4, 8));
    }
    if (pastedCode.length > 3) {
      this.focusElement(this.inputs?.get(1));
    }
  }

  private pushEmptyFormControls(): void {
    for (let i = 0; i < 2; i++) {
      (this.form.get('code') as FormArray).push(
        new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(this.ACTIVATION_CODE_REGEXP)])
      );
    }
  }

  private focusElement(element: ElementRef | undefined): void {
    setTimeout(() => {
      if (element) {
        element.nativeElement.focus();
      }
    }, 0);
  }

  private patchForm(formValues: ActivateAccountDto | null): void {
    if (formValues?.activationKey) {
      (this.form.get('code') as FormArray).at(0).patchValue(formValues.activationKey.substring(0, 4));
      (this.form.get('code') as FormArray).at(1).patchValue(formValues.activationKey.substring(4, 8));
    }
  }
}
