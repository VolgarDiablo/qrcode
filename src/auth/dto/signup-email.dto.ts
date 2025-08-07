import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsStrongPassword,
} from 'class-validator';

export class SignupEmailDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
