import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { LoginDTO } from './login-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(LoginDTO: LoginDTO): Promise<{ accessToken: string }> {
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
    const accessToken = await this.jwtService.signAsync(
      {
        email: user.email,
        id: user.id,
      },
      { expiresIn: '1d' },
    );
    return { accessToken };
  }

  async dencryptPassword(plainText, hash) {
    return await bcrypt.compare(plainText, hash);
  }
}
