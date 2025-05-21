import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { ISignupRequest } from './interface/sighup.intertace';
import { ILoginRequest } from './interface/sighin.interface';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from './constants';
import { ITokenResponse } from './interface/token-response.interface.ts';
import { IUserResponse } from './interface/user-response.interface';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(payload: ISignupRequest) {
    const hash = await this.encryptPassword(payload.password, 10);

    payload.password = hash;
    await this.prisma.user.create({
      data: payload,
    });
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
    const token = this.generateToken({ id: user.id });
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

  generateToken(payload: object): string {
    return jwt.sign(payload, jwtConstants.secret, { expiresIn: '30d' });
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
