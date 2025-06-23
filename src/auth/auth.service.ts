import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { ISignupRequest } from './interface/sighup.intertace';
import { ILoginRequest } from './interface/sighin.interface';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from './constants';
import { ITokenResponse } from './interface/token-response.interface.ts';
import { IUserResponse } from './interface/user-response.interface';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}
  async signup(payload: ISignupRequest) {
    const hash = await this.encryptPassword(payload.password, 10);

    payload.password = hash;

    const user = await this.prisma.user.create({
      data: payload,
    });

    await this.sendVerificationEmail(user);
  }

  async encryptPassword(plainText, saltRounds) {
    return await bcrypt.hash(plainText, saltRounds);
  }

  async login(LoginDTO: ILoginRequest): Promise<ITokenResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: LoginDTO.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isMathed = await this.decryptPassword(
      LoginDTO.password,
      user.password,
    );

    if (!isMathed) {
      throw new UnauthorizedException('Invalid password');
    }

    if (!user.emailVerified) {
      await this.sendVerificationEmail(user, 'https://www.google.com/');
      throw new UnauthorizedException(
        'Email not verified. Verification link sent.',
      );
    }

    const token = this.generateTokenActive({ id: user.id });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        metaData: { token },
      },
    });

    return { token };
  }

  async decryptPassword(plainText, hash) {
    return await bcrypt.compare(plainText, hash);
  }

  generateTokenActive(payload: object): string {
    return jwt.sign(payload, jwtConstants.secret, { expiresIn: '30d' });
  }

  generateTokenEmailVerify(payload: object): string {
    return jwt.sign(payload, jwtConstants.secret, { expiresIn: '10m' });
  }

  verifyTokenActive(token: string): { id: number } {
    try {
      return jwt.verify(token, jwtConstants.secret) as { id: number };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async sendVerificationEmail(user: User, redirectPath?: string) {
    const tokenEmailVerify = this.generateTokenEmailVerify({ id: user.id });

    const url = new URL('/auth/email/verify', process.env.APP_BASE_URL);
    url.searchParams.set('token', tokenEmailVerify);
    if (redirectPath) url.searchParams.set('redirect', redirectPath);

    console.log(url.toString());

    // await this.emailService.sendTestEmail(
    //   user.email,
    //   `Привет, ${user.name}. Подтверди почту: ${fullUrl}`,
    // );
  }

  async confirmEmail(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException();
    if (user.emailVerified == true) return;

    return this.prisma.user.update({
      where: { id },
      data: { emailVerified: true },
    });
  }

  async findByIdRaw(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findById(id: number): Promise<IUserResponse | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
      },
    });
  }
}
