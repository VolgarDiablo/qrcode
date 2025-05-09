import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { SignupRequest } from './intertace';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(payload: SignupRequest) {
    const hash = await this.encryptPassword(payload.password, 10);

    payload.password = hash;
    return await this.prisma.user.create({
      data: {
        ...payload,
        metaData: { ip: '127.0.0.1' },
      },
    });
  }

  async encryptPassword(plainText, saltRounds) {
    return await bcrypt.hash(plainText, saltRounds);
  }
}
