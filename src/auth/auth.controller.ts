import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  HttpCode,
  Query,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login-dto';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';
import { TokenResponseDTO } from './dto/token-response-dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { Response } from 'express';

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

  @Get('email/verify')
  async verifyEmail(
    @Res() res: Response,
    @Query('token') token: string,
    @Query('redirect') redirect?: string,
  ) {
    const payload = this.authService.verifyTokenActive(token);
    if (!payload?.id) throw new BadRequestException('Invalid token');

    const user = await this.authService.findByIdRaw(payload.id);
    if (!user) throw new BadRequestException('User not found');

    if (user.emailVerified) {
      return res.send('✅ Mail has already been confirmed');
    }

    await this.authService.confirmEmail(payload.id);

    if (redirect) {
      const jwt = this.authService.generateTokenActive({ id: payload.id });

      const url = new URL(redirect, process.env.FRONTEND_URL);
      url.searchParams.set('token', jwt);

      return res.redirect(302, url.toString());
    }

    return res.send('✅ Email verified successfully');
  }
}
