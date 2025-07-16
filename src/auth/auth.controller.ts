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
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { TokenResponseDTO } from './dto/token-response-dto';
import { UserResponseDTO } from './dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  @HttpCode(201)
  async create(
    @Body() createUserDTO: CreateUserDTO,
    @Req() req: Request,
  ): Promise<void> {
    const origin = req.headers.origin ?? 'http://localhost:3000';
    await this.authService.signup(createUserDTO, origin);
  }

  @Post('/signin')
  async login(
    @Body() loginDTO: LoginDTO,
    @Req() req: Request,
  ): Promise<TokenResponseDTO> {
    const origin = req.headers.origin ?? 'http://localhost:3000';
    const token = await this.authService.login(loginDTO, origin);

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
  async verifyEmail(@Res() res: Response, @Query('token') token: string) {
    const payload = this.authService.verifyTokenActive(token);
    if (!payload?.id) throw new BadRequestException('Invalid token');

    const user = await this.authService.findByIdRaw(payload.id);
    if (!user) throw new BadRequestException('User not found');

    if (user.emailVerified) {
      return res.send('✅ Mail has already been confirmed');
    }

    await this.authService.confirmEmail(payload.id, token);

    return res.send('✅ Email verified successfully');
  }
}
