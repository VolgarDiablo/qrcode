import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './create-user-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class UsersController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  async create(
    @Body()
    createUserDTO: CreateUserDTO,
  ) {
    return await this.authService.signup(createUserDTO);
  }
}
