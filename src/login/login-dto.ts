import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { LoginRequest } from './interface';

export class LoginDTO implements LoginRequest {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
