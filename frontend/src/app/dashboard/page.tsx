"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  ShieldCheck,
  Search,
  Menu,
  X,
  TrendingUp,
  Activity
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get('/matches');
        setUpcomingMatches(response.data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch matches:', error);
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

  const navLinks = [
    { name: "Exchange", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Live Matches", icon: Activity, href: "/matches" },
    { name: "Leaderboard", icon: Trophy, href: "/leaderboard" },
    { name: "My Profile", icon: CircleUser, href: "/profile" },
    { name: "Admin Panel", icon: ShieldCheck, href: "/admin", admin: true },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0D0D]">
      {/* Top Header - Satyam77 Style */}
      <header className="h-16 bg-[#1A1A1A] border-b border-[#2A2A2A] fixed top-0 w-full z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-text-muted hover:text-white transition-colors">
            {sidebarOpen ? <X /> : <Menu />}
          </button>
          <h1 className="text-2xl font-black text-primary italic tracking-tighter cursor-pointer" onClick={() => router.push('/dashboard')}>
            CRIC<span className="text-white">BET</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end px-4 border-r border-[#2A2A2A]">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Balance</span>
            <span className="text-primary font-black text-sm">125,450 <span className="text-[10px]">PTS</span></span>
          </div>
          <div className="hidden md:flex flex-col items-end px-4 border-r border-[#2A2A2A]">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Exposure</span>
            <span className="text-pink-400 font-black text-sm">12,500 <span className="text-[10px]">PTS</span></span>
          </div>
          <button className="p-2 text-text-muted hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-[#1A1A1A]"></span>
          </button>
          <div className="w-10 h-10 rounded-full bg-surface-light border border-border flex items-center justify-center text-primary font-black cursor-pointer hover:border-primary transition-all">
            AD
          </div>
        </div>
      </header>

      <div className="flex pt-16 flex-1">
        {/* Sidebar - Collapsible */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} transition-all duration-300 bg-[#1A1A1A] border-r border-[#2A2A2A] fixed h-full z-40`}>
          <div className="p-4">
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search Sport..." 
                className="w-full bg-[#0D0D0D] border border-border rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:border-primary outline-none transition-all"
              />
            </div>

            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`sidebar-link ${pathname === link.href ? 'active' : ''} ${link.admin ? 'border border-primary/20 mt-4' : ''}`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                  {link.name === "Exchange" && <span className="ml-auto text-[10px] bg-primary text-black font-black px-1.5 rounded animate-pulse">LIVE</span>}
                </Link>
              ))}
            </nav>

            <button 
              onClick={handleLogout}
              className="sidebar-link text-red-500 hover:bg-red-500/10 mt-20 w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 p-8`}>
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Active Bets", val: "24", icon: TrendingUp, color: "text-blue-400" },
              { label: "In-Play Matches", val: "12", icon: Zap, color: "text-primary" },
              { label: "Profit/Loss", val: "+₹2.5k", icon: Trophy, color: "text-green-500" },
              { label: "Rank", val: "#12", icon: Medal, color: "text-amber-500" },
            ].map((stat, i) => (
              <div key={i} className="card p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-2xl font-black italic ${stat.color}`}>{stat.val}</p>
                </div>
                <stat.icon className={`w-8 h-8 opacity-20 ${stat.color}`} />
              </div>
            ))}
          </div>

          {/* Matches Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black italic tracking-tight flex items-center gap-3">
                <div className="w-2 h-6 bg-primary rounded-full"></div>
                LIVE EXCHANGE
              </h2>
              <Link href="/matches" className="text-xs font-bold text-primary hover:underline">VIEW ALL</Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-32 card animate-pulse" />)
              ) : (
                upcomingMatches.map((match) => (
                  <div key={match.id} className="card overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="flex flex-col md:flex-row items-center">
                      {/* Match Info */}
                      <div className="p-6 flex-1 flex items-center justify-between w-full md:w-auto">
                        <div className="flex items-center gap-4">
                          <img src={match.team_a_img} className="w-10 h-10 object-contain" />
                          <div className="text-xs font-black uppercase tracking-tighter">
                            <span className="block">{match.team_a}</span>
                            <span className="text-text-muted text-[10px]">vs</span>
                            <span className="block">{match.team_b}</span>
                          </div>
                          <img src={match.team_b_img} className="w-10 h-10 object-contain" />
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-[10px] font-bold text-zinc-500 mb-1">{new Date(match.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           <span className="text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded font-black uppercase">{match.status}</span>
                        </div>
                      </div>

                      {/* Odds Side - Satyam77 Style */}
                      <div className="bg-[#111] p-4 flex gap-4 border-l border-border w-full md:w-auto justify-end">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[8px] font-bold text-blue-400 uppercase">Back</span>
                          <div className="odds-box-back" onClick={() => router.push(`/matches/${match.id}`)}>1.88</div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[8px] font-bold text-pink-400 uppercase">Lay</span>
                          <div className="odds-box-lay" onClick={() => router.push(`/matches/${match.id}`)}>1.92</div>
                        </div>
                        <div className="flex flex-col items-center gap-1 ml-4">
                          <span className="text-[8px] font-bold text-zinc-600 uppercase">Status</span>
                          <Link href={`/matches/${match.id}`} className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 transition-all">
                             <ChevronRight className="w-5 h-5 text-primary" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// Add these Lucide icons that were missing
const Medal = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.61 2.14a2 2 0 0 1 .13 2.2L16.79 15"/><circle cx="12" cy="15" r="5"/><path d="M12 18v-2"/></svg>
);
