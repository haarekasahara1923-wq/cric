import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(data: any) {
    const { email, password, name } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        points_balance: 10000, // Starting balance
      },
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async login(data: any) {
    const { email, password } = data;
    
    // Check for hardcoded env admin credentials or fallback to default
    const adminEmail = process.env.ADMIN_MAIL || "admin@ipl.wapifow.site";
    const adminPassword = process.env.ADMIN_PASSWORD || "Nami@1971";
    
    let user;

    if (email === adminEmail && password === adminPassword) {
      // Upsert admin user
      user = await this.prisma.user.upsert({
        where: { email: adminEmail },
        update: { role: 'ADMIN' },
        create: {
          email: adminEmail,
          password: await bcrypt.hash(adminPassword, 10),
          name: 'Super Admin',
          role: 'ADMIN',
          points_balance: 9999999, // Infinite virtual points for admin
        }
      });
    } else {
      user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user || !(await bcrypt.compare(password, user.password || ''))) {
        throw new UnauthorizedException('Invalid email or password');
      }
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        points_balance: true,
        role: true,
        avatar_url: true,
        level: true
      }
    });
  }
}
