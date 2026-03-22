import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { MatchService } from './match.service';
import { PredictionService } from './prediction.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('matches')
export class MatchController {
  constructor(
    private matchService: MatchService,
    private predictionService: PredictionService
  ) {}

  @Get()
  async getMatches(@Query('status') status: string) {
    return this.matchService.getMatches(status);
  }

  @Get('leaderboard')
  async getLeaderboard() {
    return this.predictionService.getLeaderboard();
  }

  @UseGuards(JwtAuthGuard)
  @Post('bet/place')
  async placeBet(@Req() req, @Body() body: any) {
    return this.predictionService.placeBet(req.user.id, body);
  }

  @Get(':id')
  async getMatchById(@Param('id') id: string) {
    return this.matchService.getMatchById(id);
  }

  @Get('sync/upcoming')
  async syncUpcomingMatches() {
    await this.matchService.syncUpcomingMatches();
    return { message: 'Upcoming IPL matches sync triggered' };
  }

  @Get('sync/predictions')
  async syncAllPredictions() {
    const matches = await this.matchService.getMatches();
    for (const match of matches) {
      await this.matchService.generateMatchPredictions(match.id);
    }
    return { message: 'Predictions generation triggered for all matches' };
  }
}
