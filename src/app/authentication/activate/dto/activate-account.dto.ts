import { Dayjs } from 'dayjs';

export interface ActivateAccountDto {
  activationKey?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: Dayjs;
  email?: string;
  password?: string;
}
