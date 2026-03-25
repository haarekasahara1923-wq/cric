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
  private readonly cricketDataApiKey: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.apiHost = this.configService.get('RAPIDAPI_HOST');
    this.apiKey = this.configService.get('RAPIDAPI_KEY');
    this.cricketDataApiKey = this.configService.get('CRICKET_DATA_API');
    this.apiUrl = `https://${this.apiHost}/matches/v1/upcoming`;
  }

  async onModuleInit() {
    this.logger.log('Match Service Initialized');
    // Start sync immediately on startup
    this.syncUpcomingMatches().catch(err => {
      this.logger.error('Failed initial match sync:', err.message);
    });
  }

  @Cron('*/30 * * * * *') // Run every 30 seconds as requested
  async syncUpcomingMatches() {
    this.logger.log('🔄 Syncing matches from CricketData.org...');
    
    try {
      // 1. Fetch from CricketData.org (New main API)
      const cricketDataResponse = await axios.get(`https://api.cricketdata.org/v1/currentMatches?apikey=${this.cricketDataApiKey}`);
      const matches = cricketDataResponse.data?.data || [];
      
      this.logger.log(`🔍 Found ${matches.length} matches in CricketData.org`);

      for (const m of matches) {
        const apiMatchId = m.id;
        const teamA = m.teams[0] || 'Team A';
        const teamB = m.teams[1] || 'Team B';
        const startTime = new Date(m.dateTimeGMT);
        const venue = m.venue || 'TBA';
        const scorecardInfo = m.score ? JSON.parse(JSON.stringify(m.score)) : null;
        
        let status: MatchStatus = MatchStatus.UPCOMING;
        if (m.matchStarted) status = MatchStatus.LIVE;
        if (m.matchEnded) status = MatchStatus.COMPLETED;

        // Create or update match
        const dbMatch = await this.prisma.match.upsert({
          where: { api_match_id: apiMatchId },
          update: {
            status,
            venue,
            start_time: startTime,
            scorecard: scorecardInfo,
          },
          create: {
            api_match_id: apiMatchId,
            team_a: teamA,
            team_b: teamB,
            team_a_img: m.teamInfo?.[0]?.img || `https://flagsapi.com/IN/flat/64.png`, 
            team_b_img: m.teamInfo?.[1]?.img || `https://flagsapi.com/IN/flat/64.png`,
            start_time: startTime,
            status,
            venue,
            scorecard: scorecardInfo,
          }
        });

        // Generate predictions for new matches
        await this.generateMatchPredictions(dbMatch.id);
      }

      this.logger.log(`✅ Successfully synced matches from CricketData.org.`);
    } catch (error) {
      this.logger.error('❌ Failed to sync matches from CricketData.org:', error.message);
      
      // Fallback to RapidAPI if CricketData fails
      this.logger.log('🔄 Attempting fallback to RapidAPI...');
      await this.syncFromRapidAPI();
    }
  }

  async syncFromRapidAPI() {
    try {
      const response = await axios.get(this.apiUrl, {
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': this.apiHost
        }
      });
      
      const typeMatches = response.data?.typeMatches || [];
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
              
              let status: MatchStatus = MatchStatus.UPCOMING;
              if (matchInfo.state === 'In Progress' || matchInfo.state === 'Live') status = MatchStatus.LIVE;
              if (matchInfo.state === 'Complete') status = MatchStatus.COMPLETED;

              const dbMatch = await this.prisma.match.upsert({
                where: { api_match_id: apiMatchId },
                update: { status, venue, start_time: startTime },
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
              await this.generateMatchPredictions(dbMatch.id);
            }
          }
      }
      this.logger.log('✅ Fallback RapidAPI sync completed');
    } catch (err) {
      this.logger.error('❌ Fallback RapidAPI also failed:', err.message);
    }
  }

  @Cron('*/30 * * * * *')
  async updateLiveOdds() {
    const predictions = await this.prisma.prediction.findMany({
      where: { match: { status: { in: ['UPCOMING', 'LIVE'] } } }
    });

    for (const pred of predictions) {
      const currentOdds = (pred.odds as any) || {};
      const newOdds: any = {};
      
      if (!pred.options || !Array.isArray(pred.options)) continue;

      (pred.options as string[]).forEach(opt => {
        const base = currentOdds[opt]?.back || 1.80 + Math.random() * 0.4;
        const change = (Math.random() - 0.5) * 0.05;
        const finalBack = Math.max(1.10, Math.min(5.00, base + change));
        newOdds[opt] = {
          back: parseFloat(finalBack.toFixed(2)),
          lay: parseFloat((finalBack + 0.02 + Math.random() * 0.05).toFixed(2))
        };
      });

      await this.prisma.prediction.update({
        where: { id: pred.id },
        data: { odds: newOdds }
      });
    }
  }

  async generateMatchPredictions(matchId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });
    if (!match) return;

    const allPredictions = [
      // ===== EXCHANGE (6 markets) =====
      { type: 'EX_MATCH_WINNER', category: 'EXCHANGE', question: `Match Winner: ${match.team_a} vs ${match.team_b}`, options: [match.team_a, match.team_b] },
      { type: 'EX_TOSS_WINNER', category: 'EXCHANGE', question: `Toss Winner: ${match.team_a} or ${match.team_b}`, options: [match.team_a, match.team_b] },
      { type: 'EX_TOTAL_RUNS', category: 'EXCHANGE', question: 'Match Total Runs (Over/Under 310.5)', options: ['Under 310.5', 'Over 310.5'] },
      { type: 'EX_TOTAL_SIXES', category: 'EXCHANGE', question: 'Total Match Sixes (Over/Under 14.5)', options: ['Under 14.5', 'Over 14.5'] },
      { type: 'EX_INNINGS_RUNS', category: 'EXCHANGE', question: '1st Innings Total Runs (Over/Under 165.5)', options: ['Under 165.5', 'Over 165.5'] },
      { type: 'EX_POWERPLAY', category: 'EXCHANGE', question: 'Powerplay Runs - 6 Overs (Over/Under 48.5)', options: ['Under 48.5', 'Over 48.5'] },
      // ===== BOOKMAKER (5 markets) =====
      { type: 'BK_TOSS_MATCH_COMBO', category: 'BOOKMAKER', question: 'Toss Winner & Match Winner (Combo)', options: [`${match.team_a}/${match.team_a}`, `${match.team_a}/${match.team_b}`, `${match.team_b}/${match.team_a}`, `${match.team_b}/${match.team_b}`] },
      { type: 'BK_CENTURY', category: 'BOOKMAKER', question: 'Century scored in match?', options: ['Yes', 'No'] },
      { type: 'BK_TOP_BATSMAN', category: 'BOOKMAKER', question: 'Top Batsman of Match', options: [match.team_a, match.team_b, 'Others'] },
      { type: 'BK_TOP_BOWLER', category: 'BOOKMAKER', question: 'Top Wicket Taker of Match', options: [match.team_a, match.team_b, 'Others'] },
      { type: 'BK_MOST_SIXES', category: 'BOOKMAKER', question: 'Team to hit most sixes', options: [match.team_a, match.team_b, 'Draw'] },
      { type: 'BK_HAT_TRICK', category: 'BOOKMAKER', question: 'Hat-trick in match?', options: ['Yes', 'No'] },
      // ===== FANCY (3 markets) =====
      { type: 'FY_WICKET_METHOD', category: 'FANCY', question: 'Next Wicket Method', options: ['Caught', 'Bowled', 'LBW', 'Run Out', 'Others'] },
      { type: 'FY_SESSION_10', category: 'FANCY', question: '1st Innings 10 Over Runs (Over/Under 78.5)', options: ['Under 78.5', 'Over 78.5'] },
      { type: 'FY_BALL_BY_BALL', category: 'FANCY', question: 'Next Ball Outcome', options: ['Dot', 'Single', 'Boundary', 'Wicket', 'Others'] },
    ];

    for (const pred of allPredictions) {
      // Simple check: does this exact type already exist for this match?
      const exists = await this.prisma.prediction.findFirst({
        where: { match_id: matchId, type: pred.type }
      });
      if (exists) continue; // Skip if already exists, no duplicate possible

      const initialOdds: any = {};
      pred.options.forEach(opt => {
        const val = 1.80 + Math.random() * 0.4;
        initialOdds[opt] = {
          back: parseFloat(val.toFixed(2)),
          lay: parseFloat((val + 0.03).toFixed(2))
        };
      });

      await this.prisma.prediction.create({
        data: {
          match_id: matchId,
          type: pred.type,
          category: pred.category,
          question: pred.question,
          options: pred.options,
          odds: initialOdds,
          lock_time: match.start_time,
        },
      });
    }
    
    this.logger.log(`✅ Generated ${allPredictions.length} prediction types for ${match.team_a} vs ${match.team_b}`);
  }

  async getMatches(status?: string) {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    return this.prisma.match.findMany({
      where: status 
        ? { status: status as any } 
        : { start_time: { gte: twoDaysAgo } },
      orderBy: [
        { start_time: 'asc' }
      ],
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
