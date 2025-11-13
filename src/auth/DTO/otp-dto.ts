import { IsNotEmpty, Length } from 'class-validator';
import { IsPhoneForCurrentCountry } from 'src/utils/PhoneValidation';

export class codeOTPDTO {
  @IsPhoneForCurrentCountry()
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @Length(6)
  codeOTP: string;
}
