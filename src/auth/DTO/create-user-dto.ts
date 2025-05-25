import {
  IsEmail,
  IsString,
  IsNotEmpty,
  Length,
  IsStrongPassword,
} from 'class-validator';
import { ISignupRequest } from '../interface/sighup.intertace';
import { IsPhoneForCurrentCountry } from 'src/utils/PhoneValidation';

export class CreateUserDTO implements ISignupRequest {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneForCurrentCountry()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
