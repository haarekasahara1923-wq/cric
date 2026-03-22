import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PredictionService {
  constructor(private prisma: PrismaService) {}

  async placeBet(userId: string, data: { predictionId: string, option: string, amount: number, type: 'BACK' | 'LAY' }) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Get user balance
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user || user.points_balance < data.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // 2. Get prediction
      const prediction = await tx.prediction.findUnique({ where: { id: data.predictionId } });
      if (!prediction || prediction.is_settled) {
        throw new BadRequestException('Market is closed or not found');
      }

      // 3. Deduct points
      await tx.user.update({
        where: { id: userId },
        data: { points_balance: { decrement: data.amount } }
      });

      // 4. Log transaction
      await tx.walletTransaction.create({
        data: {
          user_id: userId,
          amount: data.amount,
          type: 'DEBIT',
          reason: `Bet placed on ${data.option} (${data.type})`
        }
      });

      // 5. Create user prediction
      const odds = (prediction.odds as any)?.[data.option];
      const selectedOdds = data.type === 'BACK' ? odds?.back : odds?.lay;
      
      const payout = Math.floor(data.amount * (selectedOdds || 1.85));

      return tx.userPrediction.create({
        data: {
          user_id: userId,
          prediction_id: data.predictionId,
          selected_option: data.option,
          points_used: data.amount,
          estimated_payout: payout,
          status: 'PENDING'
        }
      });
    });
  }

  async getLeaderboard() {
    return this.prisma.user.findMany({
      orderBy: { points_balance: 'desc' },
      take: 20,
      select: {
        id: true,
        name: true,
        email: true,
        points_balance: true
      }
    }).then(users => users.map(u => ({
      userId: u.id,
      score: u.points_balance,
      user: {
        name: u.name || u.email.split('@')[0],
        email: u.email
      }
    })));
  }
}
