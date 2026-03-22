"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { 
  Trophy, 
  Wallet, 
  Zap, 
  ChevronRight, 
  LayoutDashboard, 
  Calendar, 
  CircleUser,
  LogOut,
  Bell,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [balance] = useState(10000);
  const [userRank] = useState(128);
  const [level] = useState(2);
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setError(null);
        setLoading(true);
        const response = await api.get('/matches');
        setUpcomingMatches(response.data);
      } catch (err: any) {
        console.error('Failed to fetch matches:', err);
        setError(err.message || 'Unknown fetching error');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex flex-col w-64 fixed inset-y-0 bg-[#0A0A0A] border-r border-zinc-800 p-6">
        <h1 className="text-2xl font-black text-primary mb-12 italic tracking-tighter">CRICBUZZ</h1>
        
        <nav className="flex-1 space-y-4">
          <Link href="/dashboard" className="flex items-center gap-3 text-primary font-bold bg-white/5 p-3 rounded-lg">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/matches" className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors p-3 rounded-lg">
            <Calendar className="w-5 h-5" /> Matches
          </Link>
          <Link href="/leaderboard" className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors p-3 rounded-lg">
            <Trophy className="w-5 h-5" /> Leaderboard
          </Link>
          <Link href="/profile" className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors p-3 rounded-lg">
            <CircleUser className="w-5 h-5" /> Profile
          </Link>
          <Link href="/admin" className="flex items-center gap-3 text-primary/50 hover:text-primary transition-colors p-3 rounded-lg border border-primary/10 bg-primary/5 mt-4">
            <ShieldCheck className="w-5 h-5" /> Admin Panel
          </Link>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 hover:text-red-400 font-medium p-3 rounded-lg transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <main className="lg:pl-64 flex-1">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-zinc-900 sticky top-0 bg-black/80 backdrop-blur-lg z-20">
          <div className="lg:hidden h-10 w-10 flex items-center justify-center text-primary font-black italic">CB</div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-primary/20">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="font-bold text-white">{balance.toLocaleString()} pts</span>
            </div>
            
            <button className="relative text-zinc-500 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-black"></span>
            </button>
            
            <Link href="/profile" className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-black flex items-center justify-center text-black font-black uppercase text-xs">
              JD
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 md:p-10 space-y-10">
          {/* Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card bg-gradient-to-br from-[#121212] to-[#0A0A0A] p-6 border-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Trophy className="w-32 h-32 text-primary" />
              </div>
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest mb-2">Global Rank</p>
              <h3 className="text-4xl font-black text-primary">#{userRank}</h3>
              <div className="mt-4 flex items-center gap-2 text-primary text-xs font-bold">
                <ChevronRight className="w-4 h-4" /> Top 5% overall
              </div>
            </div>

            <div className="card bg-gradient-to-br from-[#121212] to-[#0A0A0A] p-6 border-zinc-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                <Zap className="w-32 h-32 text-primary" />
              </div>
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest mb-2">Platform Level</p>
              <h3 className="text-4xl font-black text-white">Level 0{level}</h3>
              <div className="mt-4 w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[65%]" />
              </div>
              <p className="mt-2 text-[10px] text-zinc-600 uppercase font-black tracking-tighter">650 / 1000 XP to GOLD</p>
            </div>

            <div className="card bg-zinc-900 border-zinc-800 p-6 flex flex-col justify-between">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">System Status</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-500">API Endpoint:</span>
                  <span className="text-white truncate max-w-[100px]">{process.env.NEXT_PUBLIC_API_URL ? 'Configured' : 'Localhost'}</span>
                </div>
                {error && (
                  <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-[9px] text-red-500 font-bold uppercase overflow-hidden">
                    Error: {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Matches Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                LIVE & UPCOMING
              </h2>
              <Link href="/matches" className="text-primary text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
              {loading ? (
                <div className="col-span-full py-20 text-center text-zinc-500 font-bold uppercase tracking-widest animate-pulse">
                  Loading matches...
                </div>
              ) : upcomingMatches.length > 0 ? (
                upcomingMatches.map((match) => (
                  <div key={match.id} className="card p-0 flex flex-col group border-zinc-800 hover:border-primary/40">
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                          <img src={match.team_a_img || 'https://flagsapi.com/IN/flat/64.png'} alt={match.team_a} className="w-full h-full object-contain" />
                        </div>
                        <span className="font-extrabold text-white text-lg">{match.team_a}</span>
                      </div>
                      
                      <div className="flex flex-col items-center flex-1 px-4">
                        <div className="text-[10px] bg-primary/20 text-primary font-black px-3 py-1 rounded-full mb-3 uppercase tracking-tighter animate-pulse">
                          VS
                        </div>
                        <span className="text-zinc-600 text-[10px] font-bold text-center uppercase tracking-tighter">
                          {new Date(match.start_time).toLocaleString([], { weekday: 'short', hour: '2-digit', minute:'2-digit' })}
                        </span>
                      </div>
  
                      <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                          <img src={match.team_b_img || 'https://flagsapi.com/IN/flat/64.png'} alt={match.team_b} className="w-full h-full object-contain" />
                        </div>
                        <span className="font-extrabold text-white text-lg">{match.team_b}</span>
                      </div>
                    </div>
                    
                    <div className="px-6 py-4 bg-white/5 border-t border-zinc-800 flex items-center justify-between mt-auto">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter flex items-center gap-1">
                        <Zap className="w-3 h-3 text-primary" /> {match.venue || 'TBA'}
                      </span>
                      <Link href={`/matches/${match.id}`} className="bg-primary hover:bg-accent text-black font-black text-[10px] px-6 py-2 rounded-lg transition-colors uppercase tracking-widest">
                        PREDICT NOW
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-900 rounded-2xl">
                  <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm mb-4">No Matches Found</p>
                  <Link href="/matches/sync/upcoming" target="_blank" className="text-primary text-[10px] font-black uppercase hover:underline">
                    Trigger Manual Sync
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-zinc-950 border-t border-zinc-900 flex items-center justify-around px-6 z-40">
        <Link href="/dashboard" className="text-primary flex flex-col items-center">
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase mt-1">Home</span>
        </Link>
        <Link href="/matches" className="text-zinc-600 hover:text-white flex flex-col items-center">
          <Calendar className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase mt-1">Matches</span>
        </Link>
        <Link href="/leaderboard" className="text-zinc-600 hover:text-white flex flex-col items-center">
          <Trophy className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase mt-1">Ranks</span>
        </Link>
        <Link href="/profile" className="text-zinc-600 hover:text-white flex flex-col items-center">
          <CircleUser className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase mt-1">Me</span>
        </Link>
      </nav>
    </div>
  );
}
