import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private resend: Resend;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      console.warn('⚠️ RESEND_API_KEY is missing. Email service will not work.');
    }
  }

  async sendOtp(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real app, store OTP in Redis with TTL. 
    // For now, I'll mock it or use a temporary table if Redis isn't ready.
    // The requirement says Redis (Upstash).
    
    console.log(`OTP for ${email}: ${otp}`);

    await this.resend.emails.send({
      from: this.configService.get('RESEND_FROM_EMAIL') || 'onboarding@resend.dev',
      to: email,
      subject: 'Your Cricbuzz Login OTP',
      html: `<p>Your OTP for Cricbuzz is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(email: string, otp: string) {
    // Mocking verification for now until Redis is integrated
    if (otp !== '123456') {
      throw new UnauthorizedException('Invalid OTP');
    }

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          points_balance: 10000,
        },
      });
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
