"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { 
  User, 
  Trophy, 
  Activity, 
  Wallet, 
  BarChart, 
  LogOut, 
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setUserData(res.data);
      } catch (err) {
        toast.error("Please login first");
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_role");
    toast.success("Successfully logged out");
    router.push("/auth/login");
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/dashboard" className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-primary transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Player Protocol</h1>
        </div>

        {/* Identity Card */}
        <div className="card bg-gradient-to-br from-[#111] via-[#0A0A0A] to-[#111] border-zinc-800 p-8 rounded-[2.5rem] mb-8 relative overflow-hidden group flex flex-col md:flex-row items-center gap-8">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <User size={150} />
           </div>
           
           <div className="relative z-10 w-32 h-32 rounded-full bg-zinc-900 border-2 border-primary/20 flex items-center justify-center text-5xl font-black uppercase text-text-muted shrink-0 shadow-[0_0_30px_rgba(204,244,0,0.1)]">
              {userData?.name?.[0] || 'U'}
           </div>

           <div className="relative z-10 text-center md:text-left flex-1">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white mb-2">{userData?.name || 'Player'}</h2>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-6">{userData?.email}</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                 <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary block mb-1">Level</span>
                    <span className="text-xl font-black italic">{userData?.level || 1}</span>
                 </div>
                 <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 block mb-1">Role</span>
                    <span className="text-sm font-black text-white mt-1 block uppercase">{userData?.role || 'USER'}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
           {[
             { label: "My Wallet", icon: Wallet, href: "/wallet" },
             { label: "Performance", icon: BarChart, href: "/leaderboard" },
             { label: "Recent Bets", icon: Activity, href: "/dashboard" },
             { label: "Achievements", icon: Trophy, disabled: true },
           ].map((item, i) => (
             item.disabled ? (
               <div key={i} className="p-6 rounded-3xl border flex flex-col items-center gap-3 transition-all bg-zinc-900 border-zinc-800 text-zinc-600 opacity-50 cursor-not-allowed">
                  <item.icon size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">{item.label} <br/><span className="text-[7px]">Coming Soon</span></span>
               </div>
             ) : (
               <button 
                 key={i} 
                 onClick={() => router.push(item.href || '#')}
                 className="p-6 rounded-3xl border flex flex-col items-center gap-3 transition-all bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary hover:bg-primary/5 active:scale-95"
               >
                  <item.icon size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
               </button>
             )
           ))}
        </div>

        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-red-950/20 border border-red-900/40 text-red-500 hover:bg-red-500 hover:text-black font-black uppercase tracking-widest text-[10px] transition-all group active:scale-[0.98]">
           <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Sign Out Protocol
        </button>
      </div>
    </div>
  );
}
