import { Controller, Post, Body, Get, UseGuards, Param, Patch } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { SettlementService } from '../settlement/settlement.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private prisma: PrismaService,
    private settlementService: SettlementService
  ) {}

  @Get('stats')
  async getDashboardStats() {
    const userCount = await this.prisma.user.count();
    const matchCount = await this.prisma.match.count();
    const predictionCount = await this.prisma.userPrediction.count();
    const totalPointsPlaced = await this.prisma.userPrediction.aggregate({
      _sum: { points_used: true }
    });

    return {
      users: userCount,
      matches: matchCount,
      predictions: predictionCount,
      totalPoints: totalPointsPlaced._sum.points_used || 0
    };
  }

  @Post('match')
  async createMatch(@Body() data: any) {
    return this.prisma.match.create({ data });
  }

  @Post('prediction')
  async createPrediction(@Body() data: any) {
    return this.prisma.prediction.create({
      data: {
        match_id: data.match_id,
        type: data.type,
        category: data.category || 'EXCHANGE',
        question: data.question,
        options: data.options,
        lock_time: new Date(data.lock_time),
      }
    });
  }

  @Post('settle/:matchId')
  async settleMatch(@Param('matchId') matchId: string, @Body('results') results: any) {
    return this.settlementService.settleMatch(matchId, results);
  }

  @Get('matches')
  async getAllMatches() {
    return this.prisma.match.findMany({
      orderBy: { start_time: 'desc' },
      include: {
        predictions: true
      }
    });
  }

  @Get('users')
  async getAllUsers() {
    return this.prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      take: 50,
      select: {
        id: true,
        email: true,
        name: true,
        points_balance: true,
        level: true,
        role: true,
        created_at: true
      }
    });
  }
}
