import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsNotEmpty,
  Length,
  IsStrongPassword,
} from 'class-validator';
import { SignupRequest } from '../interface/sighup-intertace';

export class CreateUserDTO implements SignupRequest {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber(undefined)
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
