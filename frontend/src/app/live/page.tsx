"use client";

import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Activity, 
  Zap, 
  RefreshCw,
  Trophy,
  Target,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function LiveScoreboardPage() {
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveScores = async () => {
    setRefreshing(true);
    try {
      // Fetch only LIVE matches
      const response = await api.get('/matches?status=LIVE');
      setLiveMatches(response.data);
    } catch (error) {
      console.error('Failed to fetch live scores:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveScores();
    const interval = setInterval(fetchLiveScores, 15000); // Auto refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="h-20 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-zinc-800 rounded-xl transition-all">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
             <h1 className="text-2xl font-black italic tracking-tighter text-primary uppercase leading-none">Live Scoreboard</h1>
             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Real-time match analytics</p>
          </div>
        </div>
        
        <button 
          onClick={fetchLiveScores}
          className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl text-primary hover:bg-primary/20 transition-all group"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest">Refresh Now</span>
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-10">
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-zinc-900/50 rounded-[2rem] animate-pulse" />)}
          </div>
        ) : liveMatches.length === 0 ? (
          <div className="text-center py-32 bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-800">
             <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-zinc-700" />
             </div>
             <h3 className="text-xl font-black italic text-white uppercase mb-2">No Live Matches Right Now</h3>
             <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">Check the "Upcoming" section for today's schedule</p>
             <Link href="/matches" className="mt-8 inline-block px-8 py-3 bg-primary text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">View All Fixtures</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {liveMatches.map((match) => (
              <div key={match.id} className="group relative">
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                
                <div className="relative card bg-[#0D0D0D] border-zinc-800 p-8 rounded-[2.5rem] overflow-hidden">
                  {/* LIVE Badge */}
                  <div className="absolute top-0 right-0 py-2 px-6 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-bl-2xl flex items-center gap-2 animate-pulse">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    Live Now
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    {/* Team A */}
                    <div className="flex-1 text-center md:text-right space-y-4">
                      <div className="w-20 h-20 bg-zinc-900 rounded-3xl p-3 mx-auto md:ml-auto md:mr-0 border border-zinc-800 shadow-xl group-hover:border-primary/50 transition-all duration-500">
                        <img src={match.team_a_img} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter leading-none mb-1">{match.team_a}</h2>
                        {match.scorecard?.[0] && (
                          <div className="space-y-1">
                            <p className="text-4xl font-black text-primary italic tracking-tighter">{match.scorecard[0].r}/{match.scorecard[0].w}</p>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">{match.scorecard[0].o} OVERS</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* VS Center */}
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-12 h-12 bg-zinc-900 rounded-full border border-zinc-800 flex items-center justify-center font-black text-zinc-500 text-xs italic">VS</div>
                       <div className="h-12 w-[1px] bg-gradient-to-b from-zinc-800 to-transparent"></div>
                    </div>

                    {/* Team B */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                      <div className="w-20 h-20 bg-zinc-900 rounded-3xl p-3 mx-auto md:mr-auto md:ml-0 border border-zinc-800 shadow-xl group-hover:border-primary/50 transition-all duration-500">
                        <img src={match.team_b_img} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter leading-none mb-1">{match.team_b}</h2>
                        {match.scorecard?.[1] ? (
                          <div className="space-y-1">
                            <p className="text-4xl font-black text-white italic tracking-tighter">{match.scorecard[1].r}/{match.scorecard[1].w}</p>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">{match.scorecard[1].o} OVERS</p>
                          </div>
                        ) : (
                          <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mt-4">Yet to Bat</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Venue & Time Info */}
                  <div className="mt-10 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 text-primary">
                        <Target size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Current Venue</p>
                        <p className="text-sm font-black text-white italic uppercase tracking-tight">{match.venue}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                       <Link 
                        href={`/matches/${match.id}`}
                        className="px-8 py-3 bg-primary text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-accent transition-all flex items-center gap-2"
                       >
                         Place Bets <Zap size={14} />
                       </Link>
                       <Link 
                        href={`/dashboard`}
                        className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all"
                       >
                         <LayoutDashboard size={20} />
                       </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
