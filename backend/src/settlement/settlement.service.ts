import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SettlementService {
  private readonly logger = new Logger(SettlementService.name);

  constructor(private prisma: PrismaService) {}

  async settleMatch(matchId: string, results: any) {
    this.logger.log(`Settling match ${matchId}...`);
    
    const predictions = await this.prisma.prediction.findMany({
      where: { match_id: matchId, is_settled: false }
    });

    for (const pred of predictions) {
      // Find the correct option for this prediction from 'results'
      const correctOption = results[pred.type]; // Logic based on RapidAPI response
      
      if (!correctOption) continue;

      await this.prisma.$transaction(async (tx) => {
        // Update prediction status
        await tx.prediction.update({
          where: { id: pred.id },
          data: { is_settled: true, correct_option: correctOption }
        });

        // Settle user predictions
        const userPreds = await tx.userPrediction.findMany({
          where: { prediction_id: pred.id, status: 'PENDING' }
        });

        for (const upred of userPreds) {
          const isWinner = upred.selected_option === correctOption;
          const status = isWinner ? 'WON' : 'LOST';
          const resultPoints = isWinner ? upred.estimated_payout : 0;

          await tx.userPrediction.update({
            where: { id: upred.id },
            data: { status, result_points: resultPoints }
          });

          if (isWinner) {
            // Credit points back to user
            await tx.user.update({
              where: { id: upred.user_id },
              data: { 
                points_balance: { increment: resultPoints },
                xp: { increment: 50 } // Reward XP for winning
              }
            });

            // Log ledger entry
            await tx.walletTransaction.create({
              data: {
                user_id: upred.user_id,
                type: 'CREDIT',
                amount: resultPoints,
                reason: `Won prediction on ${pred.type}`
              }
            });
          }
        }
      });
    }
    
    this.logger.log(`Match ${matchId} settled successfully.`);
  }
}
