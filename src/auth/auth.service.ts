import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { SignupRequest } from './interface/sighup-intertace';
import { LoginRequest } from './interface/sighin-interface';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(payload: SignupRequest) {
    const hash = await this.encryptPassword(payload.password, 10);

    payload.password = hash;
    await this.prisma.user.create({
      data: payload,
    });
  }

  async encryptPassword(plainText, saltRounds) {
    return await bcrypt.hash(plainText, saltRounds);
  }

  async login(LoginDTO: LoginRequest): Promise<{ idToken: string }> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: LoginDTO.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    const isMathed = await this.dencryptPassword(
      LoginDTO.password,
      user.password,
    );
    if (!isMathed) {
      throw new UnauthorizedException('Invalid password');
    }
    const idToken = jwt.sign(
      {
        id: user.id,
      },
      jwtConstants.secret,
      { expiresIn: '30d' },
    );
    await this.prisma.user.update({
      where: { id: user.id },

      data: {
        metaData: { idToken },
      },
    });
    return { idToken };
  }

  async dencryptPassword(plainText, hash) {
    return await bcrypt.compare(plainText, hash);
  }

  async findById(id: number) {
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
