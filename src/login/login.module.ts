import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.servise';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constans';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService, PrismaService],
})
export class LoginModule {}
