"use client";

import Link from "next/link";
import { 
  Trophy, 
  Zap, 
  ShieldCheck, 
  ChevronRight, 
  Activity, 
  BarChart3,
  Users,
  Target
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-4 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
               <Activity className="text-black w-5 h-5 font-black" />
            </div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase">CRIC<span className="text-primary italic">ORANGE</span></h1>
         </div>
         <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors">Login</Link>
            <Link href="/auth/register" className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-primary transition-all">Join Now</Link>
         </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/ipl_hero_bg_1774171334342.png" 
            alt="IPL Action" 
            className="w-full h-full object-cover scale-105 animate-pulse-slow opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center mt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 animate-in slide-in-from-bottom duration-700">
             <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">IPL 2026 LIVE PREDICTION</span>
          </div>
          
          <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase mb-6 drop-shadow-2xl">
            PREDICT <br /> <span className="text-transparent stroke-text italic font-outline-2">DOMINATE</span>
          </h2>
          
          <p className="text-zinc-400 text-sm md:text-lg max-w-2xl mx-auto font-medium tracking-wide mb-12 uppercase leading-relaxed">
            Unleash your cricket IQ on India's most premium <span className="text-white border-b-2 border-primary">virtual prediction</span> hub. 
            Real-time analytics, zero risk, infinite glory.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/login" className="group px-10 py-5 bg-primary text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40">
               Enter Arena <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-all">
               View Leaderboard
            </button>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-12 text-center opacity-40">
           <div><p className="text-xl font-black italic">50K+</p><p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">PLAYERS</p></div>
           <div className="w-[1px] h-10 bg-zinc-800" />
           <div><p className="text-xl font-black italic">₹0.00</p><p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">REAL MONEY</p></div>
           <div className="w-[1px] h-10 bg-zinc-800" />
           <div><p className="text-xl font-black italic">10M+</p><p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">PREDICTIONS</p></div>
        </div>
      </section>

      {/* Feature Blocks Section */}
      <section className="py-32 bg-[#050505] relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
         
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Fixed Layout Blocks */}
               {[
                 { 
                   title: "EXCHANGE MARKETS", 
                   desc: "Experience the thrill of a real cricket exchange with live odds and liquid markets.", 
                   icon: BarChart3,
                   color: "primary"
                 },
                 { 
                   title: "ZERO RISK PLAY", 
                   desc: "Use virtual points only. A skill-based platform designed for pure sports engagement.", 
                   icon: ShieldCheck,
                   color: "green-400"
                 },
                 { 
                   title: "IPM HUB", 
                   desc: "Compete with thousands of users in real-time and climb the season leaderboard.", 
                   icon: Users,
                   color: "blue-400"
                 }
               ].map((feature, idx) => (
                 <div key={idx} className="group relative p-8 rounded-[2.5rem] bg-[#0A0A0A] border border-zinc-900 overflow-hidden hover:border-primary/20 transition-all duration-500 min-h-[300px] flex flex-col justify-between">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                       <feature.icon size={180} />
                    </div>
                    
                    <div>
                       <div className={`w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                          <feature.icon className={`text-${feature.color} w-6 h-6`} />
                       </div>
                       <h3 className="text-xl font-black italic tracking-tighter uppercase mb-4 text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                       <p className="text-zinc-500 text-sm font-medium leading-relaxed uppercase tracking-tight">
                          {feature.desc}
                       </p>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-white transition-colors">
                       Learn More <ChevronRight size={14} />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Gamification Teaser */}
      <section className="py-20 container mx-auto px-6">
         <div className="card bg-gradient-to-br from-[#111] to-black border-zinc-800 p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150"><Trophy size={200} /></div>
            
            <div className="md:w-1/2 relative z-10">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6 italic">Season Rewards</h3>
               <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-[0.9]">CLIMB THE <br /> PLATINUM LEAGUE</h2>
               <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed mb-8">
                  Earn XP with every correct prediction. Tier-up from Bronze to Platinum and unlock exclusive badges and prestige.
               </p>
               <button className="px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-primary transition-all">Explore Rewards</button>
            </div>
            
            <div className="md:w-1/3 grid grid-cols-2 gap-4 relative z-10">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="aspect-square bg-black border border-zinc-800 rounded-3xl flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                    <ShieldCheck className="w-10 h-10 text-primary opacity-20" />
                 </div>
               ))}
            </div>
         </div>
      </section>

      <footer className="py-20 bg-black border-t border-zinc-900 text-center">
         <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
               <Activity className="text-black w-4 h-4 font-black" />
            </div>
            <h1 className="text-lg font-black italic tracking-tighter uppercase">CRIC<span className="text-primary">ORANGE</span></h1>
         </div>
         <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] mb-4">India's Ultimate Sports Prediction Platform</p>
         <div className="flex gap-8 justify-center text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-12">
            <span className="hover:text-primary cursor-pointer transition-colors">Safety</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Partners</span>
         </div>
         <p className="text-[9px] text-zinc-800 font-bold uppercase tracking-widest">© 2026 CRICORANGE VIRTUAL LTD. ALL RIGHTS RESERVED. 18+ SKILL BASED GAMING ONLY.</p>
      </footer>

      <style jsx global>{`
        .font-outline-2 {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
        }
        .stroke-text {
          color: transparent;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 12s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </main>
  );
}
