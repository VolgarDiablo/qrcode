import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './DTO/create-user-dto';
import { AuthService } from './auth.service';
import { LoginDTO } from 'src/auth/DTO/login-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  async create(
    @Body()
    createUserDTO: CreateUserDTO,
  ) {
    return await this.authService.signup(createUserDTO);
  }

  @Post('/signin')
  async login(
    @Body()
    loginDTO: LoginDTO,
  ) {
    return await this.authService.login(loginDTO);
  }
}
