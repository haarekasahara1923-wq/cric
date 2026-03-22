"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Trophy, 
  ChevronLeft,
  Medal,
  Users,
  TrendingUp,
  Activity,
  Search
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/leaderboard');
        setPlayers(response.data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Satyam77 Style Header */}
      <header className="h-16 bg-[#1A1A1A] border-b border-[#2A2A2A] sticky top-0 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-text-muted hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <span className="font-black text-lg italic tracking-tighter text-primary uppercase">Player Leaderboard</span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-2">
           <Search className="w-3 h-3 text-text-muted" />
           <input type="text" placeholder="Search user..." className="bg-transparent text-[10px] font-bold outline-none uppercase tracking-widest" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 md:p-10">
        {/* Top 3 Podiums - Satyam77 Premium Look */}
        {!loading && players.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-12 items-end">
            {/* Rank 2 */}
            <div className="flex flex-col items-center gap-4 p-6 bg-zinc-900/30 rounded-2xl border border-zinc-900 h-[220px] justify-center text-center relative">
              <div className="absolute top-0 right-0 p-3"><Activity className="w-4 h-4 text-zinc-700" /></div>
              <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-xl font-black text-zinc-600">2</div>
              <div className="font-black text-xs uppercase tracking-tighter truncate w-full">{players[1].user?.name}</div>
              <div className="text-primary font-black text-sm">{players[1].score.toLocaleString()} <span className="text-[10px] opacity-60">PTS</span></div>
            </div>
            
            {/* Rank 1 */}
            <div className="flex flex-col items-center gap-6 p-8 bg-primary rounded-2xl h-[300px] justify-center text-center shadow-2xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
              <Trophy className="w-16 h-16 text-black animate-bounce" />
              <div className="w-20 h-20 rounded-full bg-black/10 border-4 border-black/10 flex items-center justify-center text-2xl font-black text-black">1</div>
              <div className="font-black text-black text-xl uppercase tracking-tighter truncate w-full">{players[0].user?.name}</div>
              <div className="bg-black text-primary px-6 py-1.5 rounded-full font-black text-xs scale-110 shadow-lg">{players[0].score.toLocaleString()} PTS</div>
            </div>

            {/* Rank 3 */}
            <div className="flex flex-col items-center gap-4 p-6 bg-zinc-900/30 rounded-2xl border border-zinc-900 h-[180px] justify-center text-center relative">
              <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-xl font-black text-zinc-600">3</div>
              <div className="font-black text-xs uppercase tracking-tighter truncate w-full">{players[2].user?.name}</div>
              <div className="text-primary font-black text-sm">{players[2].score.toLocaleString()} <span className="text-[10px] opacity-60">PTS</span></div>
            </div>
          </div>
        )}

        {/* List Table - Exchange History Style */}
        <div className="card bg-[#1A1A1A] border-[#2A2A2A] overflow-hidden">
          <div className="bg-[#252525] px-6 py-4 border-b border-[#2A2A2A] flex justify-between items-center">
             <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Global Rankings</h4>
             <span className="text-[10px] font-bold text-text-muted uppercase">Updates every 5 mins</span>
          </div>

          <div className="divide-y divide-[#2A2A2A]">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 bg-[#1A1A1A] animate-pulse" />)
            ) : players.map((player, idx) => (
              <div key={player.userId} className={`flex items-center justify-between p-6 hover:bg-white/5 transition-all group ${idx === 0 ? 'bg-primary/5 border-l-4 border-primary' : ''}`}>
                <div className="flex items-center gap-8">
                  <span className={`w-6 text-center font-black italic text-lg ${idx < 3 ? 'text-primary' : 'text-zinc-700'}`}>
                    {idx + 1}
                  </span>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-[#0D0D0D] border border-zinc-800 flex items-center justify-center text-xs font-black text-text-muted group-hover:border-primary transition-colors">
                        {player.user?.name?.[0] || 'U'}
                     </div>
                     <div>
                        <div className="font-black text-sm uppercase tracking-tight text-white">{player.user?.name}</div>
                        <div className="flex gap-2 mt-1">
                           <span className="text-[8px] bg-green-500/10 text-green-500 font-bold px-1.5 py-0.5 rounded">WINNER</span>
                           <span className="text-[8px] text-zinc-600 font-bold uppercase">#PRO</span>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                   <div className="text-primary font-black text-lg italic tracking-tight">{player.score.toLocaleString()} <span className="text-[9px] opacity-60 uppercase font-bold not-italic">pts</span></div>
                   <div className="flex items-center gap-1 text-[8px] text-zinc-600 font-black uppercase tracking-tighter mt-1">
                      <TrendingUp className="w-2.5 h-2.5 text-green-500" /> +{Math.floor(Math.random() * 500)} today
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-black font-black text-xl">#</div>
               <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tighter">Your Position</h4>
                  <p className="text-[10px] font-bold text-text-muted uppercase">Keep predicting to reach top 100</p>
               </div>
            </div>
            <button className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-black uppercase text-primary hover:bg-zinc-800 transition-all">My Stats</button>
        </div>
      </div>
    </div>
  );
}
