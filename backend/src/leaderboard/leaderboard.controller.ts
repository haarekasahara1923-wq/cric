import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get()
  async getLeaderboard(@Query('period') period: string, @Query('limit') limit: number) {
    return this.leaderboardService.getTopPlayers(period, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyRank(@Request() req, @Query('period') period: string) {
    return this.leaderboardService.getUserRank(req.user.userId, period);
  }
}
