import { Dayjs } from 'dayjs';

export interface VerifyPasswordDto {
  password: string | null | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  birthDate: Dayjs | null | undefined;
  email: string | null | undefined;
}
