import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('matches')
export class MatchController {
  constructor(private matchService: MatchService) {}

  @Get()
  async getMatches(@Query('status') status: string) {
    return this.matchService.getMatches(status);
  }

  @Get(':id')
  async getMatchById(@Param('id') id: string) {
    return this.matchService.getMatchById(id);
  }
}
