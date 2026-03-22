import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class LeaderboardService implements OnModuleInit {
  private redis: Redis;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const redisUrl = this.configService.get('REDIS_URL') || this.configService.get('REDIS_PUBLIC_REDIS_URL');
    if (redisUrl) {
      this.redis = new Redis(redisUrl);
    } else {
      console.error('❌ REDIS_URL or REDIS_PUBLIC_REDIS_URL is missing!');
    }
  }

  async updateScore(userId: string, points: number) {
    // Add points to seasonal leaderboard in Redis
    await this.redis.zadd('leaderboard:season', 'GT', points, userId);
    
    // Also update periodic leaderboards
    const today = new Date().toISOString().split('T')[0];
    await this.redis.zadd(`leaderboard:daily:${today}`, 'INCR', points, userId);
  }

  async getTopPlayers(period: string = 'season', limit: number = 10) {
    const key = period === 'season' ? 'leaderboard:season' : `leaderboard:daily:${new Date().toISOString().split('T')[0]}`;
    
    // Get top IDs and scores
    const top = await this.redis.zrevrange(key, 0, limit - 1, 'WITHSCORES');
    
    const results = [];
    for (let i = 0; i < top.length; i += 2) {
      const userId = top[i];
      const score = parseInt(top[i + 1]);
      
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true, avatar_url: true }
      });

      results.push({
        userId,
        score,
        rank: (i / 2) + 1,
        user
      });
    }

    return results;
  }

  async getUserRank(userId: string, period: string = 'season') {
    const key = period === 'season' ? 'leaderboard:season' : `leaderboard:daily:${new Date().toISOString().split('T')[0]}`;
    const rank = await this.redis.zrevrank(key, userId);
    const score = await this.redis.zscore(key, userId);
    
    return {
      rank: rank !== null ? rank + 1 : null,
      score: score !== null ? parseInt(score) : 0
    };
  }
}
