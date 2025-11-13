// src/otp/otp.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { OtpService } from './otp.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CacheModule.register()],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
