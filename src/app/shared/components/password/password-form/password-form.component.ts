import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import {PasswordStrength} from '../password-strength.enum';
import {LoadingManager} from '../../../directives/loading/loading-manager';


@Component({
  selector: 'myp-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
})
export class PasswordFormComponent implements AfterViewInit {
  @Input() passwordStrength: PasswordStrength = PasswordStrength.NONE;
  @Input() loadingManager = new LoadingManager();
  @Input() buttonContent!: string;
  @Output() submitPassword: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('password') passwordInput?: ElementRef<HTMLInputElement>;

  form = this.fb.group({
    password: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
  });
  isPasswordVisible = false;
  password$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(private fb: FormBuilder) {}

  ngAfterViewInit(): void {
    if (this.passwordInput) {
      this.passwordInput.nativeElement.focus();
    }
  }

  toggleShowPassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  emitPasswordChange(): void {
    this.password$.next(this.form.get('password')?.value);
  }

  submit(): void {
    this.submitPassword.emit(this.form.get('password')?.value);
  }
}
