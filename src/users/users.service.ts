import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './create-user-dto';
import { SignupResponsive } from './user';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async signup(payload: CreateUserDTO): Promise<SignupResponsive> {
    const hash = await this.encryptPassword(payload.password, 10);

    payload.password = hash;
    return await this.prisma.user.create({
      data: { ...payload, metaData: { ip: '127.0.0.1' } },
      select: {
        name: true,
        email: true,
      },
    });
  }

  async encryptPassword(plainText, saltRounds) {
    return await bcrypt.hash(plainText, saltRounds);
  }
}
