import { IsPhoneForCurrentCountry } from 'src/utils/PhoneValidation';
import { IsNotEmpty } from 'class-validator';

export class SignupPhoneDTO {
  @IsPhoneForCurrentCountry()
  @IsNotEmpty()
  phone: string;
}
