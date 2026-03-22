import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MatchStatus } from '@prisma/client';

@Injectable()
export class MatchService implements OnModuleInit {
  private readonly logger = new Logger(MatchService.name);
  private readonly apiHost: string;
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.apiHost = this.configService.get('RAPIDAPI_HOST');
    this.apiKey = this.configService.get('RAPIDAPI_KEY');
    this.apiUrl = `https://${this.apiHost}/matches/v1/upcoming`;
  }

  async onModuleInit() {
    this.logger.log('Match Service Initialized');
  }

  @Cron(CronExpression.EVERY_HOUR)
  async syncUpcomingMatches() {
    this.logger.log('🔄 Syncing upcoming IPL matches from RapidAPI...');
    
    try {
      const response = await axios.get(this.apiUrl, {
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': this.apiHost
        }
      });
      
      this.logger.log(`🔍 Raw API Response Structure: ${Object.keys(response.data || {}).join(', ')}`);
      
      const typeMatches = response.data?.typeMatches || [];
      if (typeMatches.length === 0) {
        this.logger.warn('⚠️ No matches found in the API response under "typeMatches".');
      }
      let iplMatchesFound = 0;

      for (const group of typeMatches) {
          const seriesMatches = group.seriesMatches || [];
          
          for (const series of seriesMatches) {
            const matches = series.seriesAdWrapper?.matches || [];
            
            for (const m of matches) {
              const matchInfo = m.matchInfo;
              if (!matchInfo) continue;

              const apiMatchId = matchInfo.matchId.toString();
              const teamA = matchInfo.team1?.teamName || 'Team A';
              const teamB = matchInfo.team2?.teamName || 'Team B';
              const startTime = new Date(parseInt(matchInfo.startDate));
              const venue = `${matchInfo.venueInfo?.ground}, ${matchInfo.venueInfo?.city}`;
              
              // Map API status to our MatchStatus
              let status: MatchStatus = MatchStatus.UPCOMING;
              if (matchInfo.state === 'In Progress' || matchInfo.state === 'Live') status = MatchStatus.LIVE;
              if (matchInfo.state === 'Complete') status = MatchStatus.COMPLETED;

              // Upsert into our DB
              const dbMatch = await this.prisma.match.upsert({
                where: { api_match_id: apiMatchId },
                update: {
                  status,
                  venue,
                  start_time: startTime,
                },
                create: {
                  api_match_id: apiMatchId,
                  team_a: teamA,
                  team_b: teamB,
                  team_a_img: `https://flagsapi.com/IN/flat/64.png`, 
                  team_b_img: `https://flagsapi.com/IN/flat/64.png`,
                  start_time: startTime,
                  status,
                  venue,
                }
              });

              // Generate predictions for new matches
              await this.generateMatchPredictions(dbMatch.id);
          }
        }
      }

      this.logger.log(`✅ Successfully synced matches.`);
    } catch (error) {
      this.logger.error('❌ Failed to sync matches from RapidAPI:', error.message);
    }
  }

  async generateMatchPredictions(matchId: string) {
    const match = await this.prisma.match.findUnique({ where: { id: matchId } });
    if (!match) return;

    const existing = await this.prisma.prediction.findFirst({
      where: { match_id: matchId }
    });
    
    if (existing) return;

    const defaultPredictions = [
      {
        type: 'MATCH_WINNER',
        question: `Who will win between ${match.team_a} and ${match.team_b}?`,
        options: [match.team_a, match.team_b],
      },
      {
        type: 'TOTAL_SIXES',
        question: 'Total sixes in this match will be?',
        options: ['Under 12.5', 'Over 12.5'],
      },
      {
        type: 'TOSS_WINNER',
        question: 'Which team will win the toss?',
        options: [match.team_a, match.team_b],
      },
      {
        type: 'HIGHEST_STRIKE_RATE',
        question: 'Will any player have a strike rate over 200?',
        options: ['Yes', 'No'],
      }
    ];

    for (const p of defaultPredictions) {
      await this.prisma.prediction.create({
        data: {
          match_id: matchId,
          type: p.type,
          question: p.question,
          options: p.options as any,
          lock_time: match.start_time,
        }
      });
    }
    
    this.logger.log(`✅ Generated 4 default predictions for match ${match.team_a} vs ${match.team_b}`);
  }

  async getMatches(status?: string) {
    return this.prisma.match.findMany({
      where: status ? { status: status as any } : {},
      orderBy: { start_time: 'asc' },
    });
  }

  async getMatchById(id: string) {
    return this.prisma.match.findUnique({
      where: { id },
      include: {
        predictions: {
          include: {
            user_predictions: {
              take: 10,
              orderBy: { created_at: 'desc' }
            }
          }
        }
      }
    });
  }
}
