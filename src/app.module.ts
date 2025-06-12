import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService, EmailModule],
})
export class AppModule {}
