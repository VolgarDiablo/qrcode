import { Module } from '@nestjs/common';
import { UsersController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [AuthService, PrismaService],
})
export class UsersModule {}
