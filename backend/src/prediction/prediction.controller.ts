import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('predictions')
export class PredictionController {
  constructor(private predictionService: PredictionService) {}

  @Get(':matchId')
  async getByMatch(@Param('matchId') matchId: string) {
    return this.predictionService.getPredictionsForMatch(matchId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('place')
  async placePrediction(
    @Request() req,
    @Body('prediction_id') predictionId: string,
    @Body('selected_option') option: string,
    @Body('points_used') points: number
  ) {
    return this.predictionService.placeUserPrediction(req.user.userId, predictionId, option, points);
  }
}
