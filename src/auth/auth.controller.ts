import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login-dto';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  @HttpCode(201)
  async create(@Body() createUserDTO: CreateUserDTO): Promise<void> {
    await this.authService.signup(createUserDTO);
  }

  @Post('/verify')
  async verify(email, type, url) {}

  @Post('/signin')
  async login(
    @Body()
    loginDTO: LoginDTO,
  ) {
    return await this.authService.login(loginDTO);
  }

  @UseGuards(AuthGuard)
  @Get()
  getAuthenticatedUser(@Req() req: Request) {
    const userId = req['user'].id;
    if (!userId) throw new UnauthorizedException();

    return this.authService.findById(Number(userId));
  }
}
