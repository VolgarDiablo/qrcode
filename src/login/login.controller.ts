import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from './login-dto';
import { LoginService } from './login.servise';

@Controller('auth')
export class LoginController {
  constructor(private loginService: LoginService) {}
  @Post('/signin')
  async login(
    @Body()
    loginDTO: LoginDTO,
  ) {
    return await this.loginService.login(loginDTO);
  }
}
