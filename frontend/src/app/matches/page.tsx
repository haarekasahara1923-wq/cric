"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Zap, 
  ChevronLeft,
  Calendar,
  Search
} from "lucide-react";
import Link from "next/link";

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get('/matches');
        setMatches(response.data);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link href="/dashboard" className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest mb-4 hover:underline">
              <ChevronLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-black italic tracking-tighter flex items-center gap-4">
              <div className="w-3 h-10 bg-primary rounded-full"></div>
              ALL MATCHES
            </h1>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search teams..." 
              className="bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-6 py-3 text-sm focus:border-primary outline-none transition-all w-full md:w-80"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <button className="px-6 py-2 bg-primary text-black font-black text-xs rounded-full uppercase tracking-widest">Upcoming</button>
          <button className="px-6 py-2 bg-zinc-900 text-zinc-500 font-bold text-xs rounded-full uppercase tracking-widest hover:text-white transition-colors">Live</button>
          <button className="px-6 py-2 bg-zinc-900 text-zinc-500 font-bold text-xs rounded-full uppercase tracking-widest hover:text-white transition-colors">Completed</button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-zinc-900/50 rounded-2xl animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <div key={match.id} className="card p-0 flex flex-col group border-zinc-800 hover:border-primary/40 relative overflow-hidden">
                <div className="p-8 flex items-center justify-between relative z-10">
                  <div className="flex flex-col items-center gap-4 flex-1">
                    <img src={match.team_a_img || 'https://flagsapi.com/IN/flat/64.png'} alt={match.team_a} className="w-16 h-16 object-contain" />
                    <span className="font-black text-white text-lg tracking-tighter italic">{match.team_a}</span>
                  </div>
                  
                  <div className="flex flex-col items-center flex-1 px-4">
                    <div className="text-[10px] bg-primary/10 text-primary border border-primary/20 font-black px-4 py-1 rounded-full mb-4 uppercase tracking-tighter">
                      VS
                    </div>
                    <span className="text-zinc-500 text-[10px] font-bold text-center uppercase tracking-tighter flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> {new Date(match.start_time).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-4 flex-1">
                    <img src={match.team_b_img || 'https://flagsapi.com/IN/flat/64.png'} alt={match.team_b} className="w-16 h-16 object-contain" />
                    <span className="font-black text-white text-lg tracking-tighter italic">{match.team_b}</span>
                  </div>
                </div>
                
                <div className="px-8 py-4 bg-white/5 border-t border-zinc-800 flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter flex items-center gap-1">
                    <Zap className="w-3 h-3 text-primary" /> {match.venue || 'TBA'}
                  </span>
                  <Link href={`/matches/${match.id}`} className="bg-primary hover:bg-white text-black font-black text-[10px] px-8 py-2.5 rounded-lg transition-all uppercase tracking-widest shadow-lg shadow-primary/20">
                    PREDICT NOW
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-zinc-950 rounded-3xl border-2 border-dashed border-zinc-900">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-zinc-700" />
            </div>
            <h3 className="text-zinc-500 font-black uppercase tracking-widest">No matches available</h3>
            <p className="text-zinc-700 text-xs mt-2 uppercase font-bold tracking-tighter">Matches will appear once synced with the system.</p>
          </div>
        )}
      </div>
    </div>
  );
}
