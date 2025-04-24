import { IsEmail, IsPhoneNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('UA')
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
