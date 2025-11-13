// src/otp/otp.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio, { Twilio } from 'twilio';

type OtpContext = 'signup' | 'login' | 'reset';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly client: Twilio;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const sid = this.config.get<string>('TWILIO_ACCOUNT_SID')!;
    const token = this.config.get<string>('TWILIO_AUTH_TOKEN')!;
    this.from = this.config.get<string>('TWILIO_SMS_FROM')!;

    this.client = twilio(sid, token);
  }

  private buildMessage(code: string, context: OtpContext): string {
    switch (context) {
      case 'signup':
        return `Your OTP code for registration: ${code}. Don't tell anyone.`;
      case 'login':
        return `Your OTP code for login: ${code}. Don't tell anyone.`;
      case 'reset':
        return `Your OTP code for resetting your password: ${code}. Don't tell anyone.`;
      default:
        return `our OTP code: ${code}. Don't tell anyone.`;
    }
  }

  async sendOtp(
    to: string,
    code: string,
    context: OtpContext,
  ): Promise<string> {
    const body = this.buildMessage(code, context);

    const msg = await this.client.messages.create({
      body,
      from: this.from,
      to,
    });

    this.logger.debug(`OTP SMS sent to ${to} for ${context}, sid=${msg.sid}`);
    return msg.sid;
  }
}
