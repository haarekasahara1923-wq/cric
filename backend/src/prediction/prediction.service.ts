import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PredictionService {
  constructor(private prisma: PrismaService) {}

  async createPredictionTemplate(data: any) {
    // Admin creates a prediction (e.g. "Who will win the match?")
    return this.prisma.prediction.create({
      data: {
        match_id: data.match_id,
        type: data.type,
        question: data.question,
        options: data.options,
        lock_time: new Date(data.lock_time),
      }
    });
  }

  async getPredictionsForMatch(matchId: string) {
    return this.prisma.prediction.findMany({
      where: { match_id: matchId },
      include: {
        user_predictions: {
          take: 5,
          orderBy: { created_at: 'desc' }
        }
      }
    });
  }

  async placeUserPrediction(userId: string, predictionId: string, optionSelected: string, pointsUsed: number) {
    const prediction = await this.prisma.prediction.findUnique({
      where: { id: predictionId },
    });

    if (!prediction) throw new BadRequestException('Prediction not found');
    if (new Date() > new Date(prediction.lock_time)) throw new BadRequestException('Prediction locked');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.points_balance < pointsUsed) throw new BadRequestException('Insufficient points');

    // Atomic transaction
    return this.prisma.$transaction(async (tx) => {
      // Deduct points
      await tx.user.update({
        where: { id: userId },
        data: { points_balance: { decrement: pointsUsed } }
      });

      // Log transaction
      await tx.walletTransaction.create({
        data: {
          user_id: userId,
          type: 'DEBIT',
          amount: pointsUsed,
          reason: `Prediction on ${prediction.type}`
        }
      });

      // Create user prediction
      return tx.userPrediction.create({
        data: {
          user_id: userId,
          prediction_id: predictionId,
          selected_option: optionSelected,
          points_used: pointsUsed,
          estimated_payout: pointsUsed * prediction.points_multiplier, // Simplified
        }
      });
    });
  }
}
