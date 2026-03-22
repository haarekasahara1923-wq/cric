"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Trophy, 
  ChevronLeft,
  Medal,
  Users,
  Target
} from "lucide-react";
import Link from "next/link";

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest mb-4 hover:underline">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black italic tracking-tighter flex items-center gap-4">
              <Trophy className="w-10 h-10 text-primary" />
              LEADERBOARD
            </h1>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-zinc-800">
              Season 1 • Mar 2026
            </div>
          </div>
        </div>

        {/* Top 3 Podiums */}
        {players.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-12 items-end">
            {/* Rank 2 */}
            <div className="flex flex-col items-center gap-4 p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 h-[220px] justify-center text-center">
              <Medal className="w-8 h-8 text-zinc-400" />
              <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-700" />
              <div className="font-bold text-sm truncate w-full">{players[1].user?.name || players[1].user?.email.split('@')[0]}</div>
              <div className="text-primary font-black text-xs">{players[1].score.toLocaleString()}</div>
            </div>
            {/* Rank 1 */}
            <div className="flex flex-col items-center gap-4 p-8 bg-primary rounded-2xl h-[280px] justify-center text-center shadow-2xl shadow-primary/20">
              <Trophy className="w-12 h-12 text-black" />
              <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40" />
              <div className="font-black text-black text-lg uppercase tracking-tighter truncate w-full">{players[0].user?.name || players[0].user?.email.split('@')[0]}</div>
              <div className="bg-black text-primary px-4 py-1 rounded-full font-black text-xs">{players[0].score.toLocaleString()}</div>
            </div>
            {/* Rank 3 */}
            <div className="flex flex-col items-center gap-4 p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 h-[180px] justify-center text-center">
              <Medal className="w-8 h-8 text-amber-600" />
              <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-700" />
              <div className="font-bold text-sm truncate w-full">{players[2].user?.name || players[2].user?.email.split('@')[0]}</div>
              <div className="text-primary font-black text-xs">{players[2].score.toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* List Table */}
        <div className="space-y-3">
          {loading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-zinc-900/50 rounded-xl animate-pulse" />
            ))
          ) : players.length > 0 ? (
            players.map((player, idx) => (
              <div key={player.userId} className="card bg-zinc-900/30 border-zinc-800/40 p-4 flex items-center justify-between hover:bg-zinc-900 transition-colors">
                <div className="flex items-center gap-6">
                  <span className={`w-8 text-center font-black italic text-lg ${idx < 3 ? 'text-primary' : 'text-zinc-600'}`}>
                    {idx + 1}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-500">
                    {player.user?.name?.[0] || player.user?.email?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{player.user?.name || player.user?.email.split('@')[0]}</div>
                    <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">W/L: 0%</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-primary font-black">{player.score.toLocaleString()}</div>
                  <div className="text-[9px] text-zinc-600 font-bold uppercase">Points Earned</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-zinc-950 rounded-3xl border border-zinc-900">
              <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Waiting for the first player to rank up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
