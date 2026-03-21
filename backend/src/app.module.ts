import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user/user.module';
import { MatchModule } from './match/match.module';
import { PredictionModule } from './prediction/prediction.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { SettlementModule } from './settlement/settlement.module';
import { GamificationModule } from './gamification/gamification.module';
import { NotificationModule } from './notification/notification.module';
import { AdminModule } from './admin/admin.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule,
    AuthModule,
    UserModule,
    MatchModule,
    PredictionModule,
    LeaderboardModule,
    SettlementModule,
    GamificationModule,
    NotificationModule,
    AdminModule,
    WebsocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
