"use client";

import { useState } from "react";
import { 
  ChevronLeft, 
  Trophy, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminPredictions() {
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  const handleSettle = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Match settled and points credited successfully!");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/admin" className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-primary transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-black italic tracking-tighter">PREDICTION CENTER</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Matches Column */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2 px-2 flex items-center gap-2 italic">
               <Trophy className="w-3 h-3" /> Select Match
            </h3>
            
            <div className="space-y-4">
              {[1, 2, 3].map((matchId) => (
                <button 
                  key={matchId} 
                  onClick={() => setSelectedMatch(matchId.toString())}
                  className={`card w-full p-4 border transition-all text-left group ${selectedMatch === matchId.toString() ? "bg-primary/5 border-primary" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">ID: #0584M{matchId}</span>
                    <span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded text-[8px] font-black uppercase">LIVE</span>
                  </div>
                  <h4 className={`font-black uppercase tracking-widest text-sm group-hover:text-primary transition-colors ${selectedMatch === matchId.toString() ? "text-primary" : "text-white"}`}>
                    RCB <span className="text-zinc-600 text-xs px-2">vs</span> KKR
                  </h4>
                  <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-700 font-bold uppercase tracking-widest pt-4 border-t border-zinc-800/50">
                    <span className="flex items-center gap-1"><Users className="w-2.5 h-2.5" /> 820 PLAYS</span>
                    <span>7:30 PM AT BENGALURU</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Column */}
          <div className="lg:col-span-2 space-y-8">
            {selectedMatch ? (
             <>
              <div className="card border-primary/20 bg-primary/5 p-8 border-dashed flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-zinc-950 border border-primary/20 flex items-center justify-center p-4 mb-6 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-110 transition-transform duration-500" />
                   <CheckCircle2 className="w-8 h-8 text-primary relative z-10" />
                 </div>
                 <h2 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">Settle Match</h2>
                 <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest max-w-sm text-center mb-8">
                   This action is final. All user predictions will be calculated and points credited to winners instantly.
                 </p>
                 
                 <div className="w-full card bg-black border-zinc-800 p-6 space-y-6">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-primary italic border-b border-primary/20 pb-2">WINNER RESULTS</h4>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Match Winner</label>
                             <select className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs outline-none focus:border-primary">
                                <option>SELECT WINNER</option>
                                <option>RCB</option>
                                <option>KKR</option>
                             </select>
                          </div>
                          <div className="space-y-1">
                             <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Toss Winner</label>
                             <select className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs outline-none focus:border-primary">
                                <option>SELECT WINNER</option>
                                <option>RCB</option>
                                <option>KKR</option>
                             </select>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="space-y-1">
                             <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Top Batsman</label>
                             <input type="text" className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs outline-none focus:border-primary" placeholder="e.g. Virat Kohli" />
                          </div>
                          <div className="space-y-1">
                             <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Top Bowler</label>
                             <input type="text" className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs outline-none focus:border-primary" placeholder="e.g. Mohammed Siraj" />
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={handleSettle}
                      disabled={loading}
                      className="w-full py-4 bg-primary text-black rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent transition-all active:scale-[0.98]"
                    >
                      {loading ? <span className="animate-spin text-lg">◌</span> : (
                        <>
                          <Send className="w-4 h-4" /> Trigger Settlement Engine
                        </>
                      )}
                    </button>
                 </div>
              </div>

               <div className="card p-6 border-red-950/20 bg-red-950/5 flex items-start gap-4">
                 <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                   <AlertTriangle className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-1">Critical Warning</h3>
                   <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-wider leading-relaxed">
                     Once triggered, settlements cannot be undone via API. All point transactions are permanent and logged in user ledgers.
                   </p>
                 </div>
               </div>
             </>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 card border-dashed border-zinc-800 bg-zinc-900/10 text-center">
                 <div className="p-4 bg-zinc-900 rounded-full mb-6">
                   <HelpCircle className="w-10 h-10 text-zinc-800" />
                 </div>
                 <h2 className="text-zinc-600 font-black italic tracking-tighter uppercase text-xl">Waiting for Selection</h2>
                 <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest max-w-xs mt-2">
                   Select a match from the left sidebar to manage predictions and trigger settlement logic.
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
