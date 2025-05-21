import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ILoginRequest } from '../interface/sighin.interface';

export class LoginDTO implements ILoginRequest {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
