import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {PasswordStrength} from '../password-strength.enum';

@Component({
  selector: 'myp-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss'],
})
export class PasswordStrengthComponent implements OnInit, OnDestroy {
  @Input() password!: Observable<string | undefined>;
  @Output() strength = new EventEmitter<PasswordStrength>();

  passwordStrengthEnum = PasswordStrength;
  isAtLeastEightCharacters = false;
  isRespectingAtLeastThreeRules = false;
  strengthLevel = PasswordStrength.NONE;

  private readonly LOWERCASE_LETTERS_REGEXP = /[a-z]/;
  private readonly UPPERCASE_LETTERS_REGEXP = /[A-Z]/;
  private readonly DIGIT_REGEXP = /[0-9]/;
  private readonly SPECIAL_CHARACTERS_REGEXP = /[!”#$%&’()*+,-./:;<=>?@[\]^_`{|}~]/;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.strength.next(PasswordStrength.NONE);
    this.password.pipe(takeUntil(this.destroy$)).subscribe(password => this.calculatePasswordStrength(password));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  set passwordStrength(value: PasswordStrength) {
    this.strengthLevel = value;
    this.strength.next(value);
  }

  private calculatePasswordStrength(passwordValue: string | undefined): void {
    if (!passwordValue) {
      this.isAtLeastEightCharacters = false;
      this.isRespectingAtLeastThreeRules = false;
      this.passwordStrength = PasswordStrength.NONE;
      return;
    }
    const respectedRulesCount = this.calculateNumberOfRespectedRules(passwordValue);
    this.isRespectingAtLeastThreeRules = respectedRulesCount > 2;
    this.isAtLeastEightCharacters = passwordValue.length > 7;
    if (passwordValue.length < 8 || respectedRulesCount < 3) {
      this.passwordStrength = PasswordStrength.WEAK;
      return;
    }
    if (passwordValue.length < 12) {
      if (respectedRulesCount === 3) {
        this.passwordStrength = PasswordStrength.MEDIUM;
      } else {
        this.passwordStrength = PasswordStrength.GOOD;
      }
      return;
    }
    if (passwordValue.length < 16 && respectedRulesCount === 3) {
      this.passwordStrength = PasswordStrength.GOOD;
      return;
    }
    this.passwordStrength = PasswordStrength.EXCELLENT;
  }

  private calculateNumberOfRespectedRules(passwordValue: string): number {
    let respectedRulesCount = 0;
    [this.LOWERCASE_LETTERS_REGEXP, this.UPPERCASE_LETTERS_REGEXP, this.DIGIT_REGEXP, this.SPECIAL_CHARACTERS_REGEXP].forEach(regexp => {
      if (regexp.exec(passwordValue) !== null) {
        respectedRulesCount++;
      }
    });
    return respectedRulesCount;
  }
}
