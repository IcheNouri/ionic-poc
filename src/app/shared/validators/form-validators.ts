import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as dayjs from 'dayjs';

const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0;
}

export class MypValidators {
  static dateFormat(format: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isEmptyInputValue(control.value) || isEmptyInputValue(format)) {
        return null; // don't validate empty values to allow optional controls
      }
      const parsed = dayjs(control.value, format);
      return parsed.isValid() ? null : { format: { format, actual: control.value } };
    };
  }

  static email(control: AbstractControl): ValidationErrors | null {
    if (isEmptyInputValue(control.value)) {
      return null; // don't validate empty values to allow optional controls
    }
    return EMAIL_REGEXP.test(control.value) ? null : { email: true };
  }
}
