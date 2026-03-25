"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  ChevronLeft,
  Search,
  Zap,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  Activity,
  Trophy,
  CircleUser,
  ShieldCheck,
  LogOut,
  Bell
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [matchesRes, userRes] = await Promise.all([
          api.get('/matches'),
          api.get('/auth/me')
        ]);
        setMatches(matchesRes.data);
        setUserData(userRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
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
      {/* Satyam77 Header */}
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
            <span className="text-primary font-black text-sm">{userData?.points_balance?.toLocaleString() || '0'} <span className="text-[10px]">PTS</span></span>
          </div>
          <button className="p-2 text-text-muted hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-[#1A1A1A]"></span>
          </button>
          <div className="w-10 h-10 rounded-full bg-surface-light border border-border flex items-center justify-center text-primary font-black cursor-pointer hover:border-primary transition-all uppercase">
            {userData?.name?.[0] || userData?.email?.[0] || 'U'}
          </div>
        </div>
      </header>

      <div className="flex pt-16 flex-1">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transform transition-transform duration-300 bg-[#1A1A1A] border-r border-[#2A2A2A] fixed h-full z-40 w-64`}>
          <div className="p-4">
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
        <main className={`flex-1 transition-all duration-300 p-4 md:p-8 ${sidebarOpen ? 'md:ml-64 ml-0' : 'ml-0'}`}>
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase flex items-center gap-4">
                   <div className="w-2 h-10 bg-primary rounded-full"></div>
                   IN-PLAY & UPCOMING
                </h2>
                <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase mt-2">Latest cricket fixtures available for exchange</p>
              </div>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search Event..." 
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl pl-12 pr-6 py-3 text-xs focus:border-primary outline-none transition-all w-full md:w-80"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-8 bg-[#1A1A1A] p-1 rounded-lg border border-[#2A2A2A] w-fit">
              <button className="px-8 py-2 bg-primary text-black font-black text-[10px] rounded-md uppercase">Cricket</button>
              <button className="px-8 py-2 text-text-muted font-bold text-[10px] hover:text-white transition-all uppercase">Football</button>
              <button className="px-8 py-2 text-text-muted font-bold text-[10px] hover:text-white transition-all uppercase">Tennis</button>
            </div>

            {/* Matches List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-[#1A1A1A] rounded-xl animate-pulse" />)}
              </div>
            ) : matches.length === 0 ? (
               <div className="text-center py-20 bg-[#1A1A1A] rounded-2xl border border-dashed border-zinc-800">
                  <Activity className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-white italic uppercase">No Active Matches</h3>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase mt-2">Check back soon for upcoming events and live markets.</p>
               </div>
            ) : (
              <div className="space-y-3">
                 {matches.map((match) => (
                    <div key={match.id} className="card bg-[#1A1A1A] border-[#2A2A2A] hover:border-primary/30 transition-all overflow-hidden">
                       <div className="flex flex-col md:flex-row items-center">
                          {/* Event Name */}
                          <div className="p-5 flex-1 flex items-center gap-6 w-full md:w-auto">
                             <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-zinc-600 block">{new Date(match.start_time).toLocaleDateString([], { day: '2-digit', month: 'short' })}</span>
                                <span className="text-xs font-black text-white">{new Date(match.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {match.status === 'LIVE' && <span className="text-[8px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded font-black mt-1 animate-pulse tracking-widest uppercase">LIVE</span>}
                             </div>
                             <div className="h-10 w-[1px] bg-zinc-800 hidden md:block" />
                             <div className="flex-1">
                                <Link href={`/matches/${match.id}`} className="text-sm font-black text-white hover:text-primary transition-colors uppercase tracking-tight">
                                   {match.team_a} v {match.team_b}
                                </Link>
                                <div className="flex items-center gap-2 mt-1">
                                   <Zap className="w-3 h-3 text-primary animate-pulse" />
                                   <span className="text-[9px] font-bold text-zinc-500 uppercase">{match.venue}</span>
                                </div>
                                {/* Live Scorecard info */}
                                {match.status === 'LIVE' && match.scorecard && match.scorecard.length > 0 && (
                                   <div className="mt-2 text-primary font-black text-xs italic bg-primary/10 w-fit px-3 py-1 rounded-md border border-primary/20">
                                      {match.scorecard[0].title || match.scorecard[0].inning}: {match.scorecard[0].r}/{match.scorecard[0].w} 
                                      <span className="text-[10px] text-zinc-400 font-bold ml-1">({match.scorecard[0].o} ov)</span>
                                   </div>
                                )}
                             </div>
                          </div>

                          {/* Odds Panel */}
                          <div className="bg-[#111] p-4 flex gap-2 border-l border-[#2A2A2A] w-full md:w-auto justify-end">
                             {/* Back/Lay for Team 1 */}
                             <div className="flex gap-1">
                                <div className="odds-box-back" onClick={() => router.push(`/matches/${match.id}`)}>1.88</div>
                                <div className="odds-box-lay" onClick={() => router.push(`/matches/${match.id}`)}>1.90</div>
                             </div>
                             {/* Back/Lay for Team 2 */}
                             <div className="flex gap-1 ml-4">
                                <div className="odds-box-back" onClick={() => router.push(`/matches/${match.id}`)}>2.05</div>
                                <div className="odds-box-lay" onClick={() => router.push(`/matches/${match.id}`)}>2.08</div>
                             </div>
                             
                             <Link href={`/matches/${match.id}`} className="ml-4 p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg hover:bg-zinc-800 transition-all group">
                                <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-primary" />
                             </Link>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
