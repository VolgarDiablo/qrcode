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
import { TokenResponseDTO } from './dto/token-response-dto';
import { UserResponseDTO } from './dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  @HttpCode(201)
  async create(@Body() createUserDTO: CreateUserDTO): Promise<void> {
    await this.authService.signup(createUserDTO);
  }

  @Post('/signin')
  async login(@Body() loginDTO: LoginDTO): Promise<TokenResponseDTO> {
    const token = await this.authService.login(loginDTO);
    return new TokenResponseDTO(token);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAuthenticatedUser(@Req() req: Request): Promise<UserResponseDTO> {
    const userId = req['user'].id;
    const user = await this.authService.findById(userId);

    if (!user) throw new UnauthorizedException();

    return new UserResponseDTO(user);
  }
}
