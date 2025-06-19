import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

    const tokenEmailVerify = this.generateTokenEmailVerify({ id: user.id });

    // await this.prisma.user.update({
    //   where: { id: user.id },

    //   data: {
    //     metaData: { tokenEmailVerify },
    //   },
    // });

    const URLEmailVerify = `${process.env.APP_BASE_URL}/auth/email/verify?token=${tokenEmailVerify}`;
    console.log(URLEmailVerify);
    // await this.emailService.sendTestEmail(
    //   payload.email,
    //   `Привет ${user.name}. Для подтверждения почты, перейдите по следующей ссылке: ${URLEmailVerify}. Данная ссылка будет активной в течение 10 минут.`,
    // );
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

  async confirmEmail(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException();

    return this.prisma.user.update({
      where: { id },
      data: { emailVerified: true },
    });
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
