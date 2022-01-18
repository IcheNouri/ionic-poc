import { Dayjs } from 'dayjs';

export class Account {
  constructor(
    public activated: boolean,
    public roles: string[],
    public operations: string[],
    public email: string,
    public firstName: string | null,
    public langKey: string,
    public lastName: string | null,
    public birthDate: Dayjs | null,
    public uuid: string | null
  ) {}
}
