"use client";

import { useState } from "react";
import { 
  ChevronLeft, 
  RefreshCw, 
  PlusCircle, 
  Clock, 
  Calendar,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminMatches() {
  const [syncing, setSyncing] = useState(false);
  const [matches] = useState([
    { id: "1", teamA: "CSK", teamB: "MI", status: "UPCOMING", time: "Mar 25, 2026, 7:30 PM", apiId: "23984" },
    { id: "2", teamA: "RCB", teamB: "KKR", status: "LIVE", time: "Mar 26, 2026, 7:30 PM", apiId: "23985" },
    { id: "3", teamA: "DC", teamB: "SRH", status: "COMPLETED", time: "Mar 22, 2026, 7:30 PM", apiId: "23982" }
  ]);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success("Successfully synced with RapidAPI!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-black italic tracking-tighter">MATCH MANAGEMENT</h1>
          </div>
          
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="px-6 py-3 bg-primary text-black rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-accent transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync RapidAPI"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-3 card border-zinc-800 bg-zinc-900/40 p-0 overflow-hidden">
             <div className="bg-zinc-800/20 p-4 border-b border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500 flex justify-between">
                <span>Total Matches Found: {matches.length}</span>
                <span>Last Sync: 2m ago</span>
             </div>
             
             <div className="divide-y divide-zinc-800/50">
                {matches.map((match) => (
                  <div key={match.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="flex -space-x-3 group-hover:scale-105 transition-transform duration-300">
                        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-black flex items-center justify-center p-2 font-black text-xs uppercase text-zinc-600 bg-white/5">{match.teamA}</div>
                        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-black flex items-center justify-center p-2 font-black text-xs uppercase text-zinc-600 bg-white/5">{match.teamB}</div>
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-white group-hover:text-primary transition-colors">{match.teamA} vs {match.teamB}</h4>
                        <div className="flex items-center gap-3 text-[10px] text-zinc-600 font-bold uppercase tracking-tighter mt-1">
                          <Clock className="w-3 h-3" /> {match.time}
                          <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                          <span className="text-zinc-700">API ID: {match.apiId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        match.status === "LIVE" ? "bg-red-500/10 text-red-500 animate-pulse border border-red-500/20" :
                        match.status === "COMPLETED" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                        "bg-zinc-800 text-zinc-500 border border-zinc-700"
                      }`}>
                        {match.status}
                      </span>
                      <button className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-primary/50 transition-colors">
                        <PlusCircle className="w-4 h-4 text-zinc-600 group-hover:text-primary" />
                      </button>
                    </div>
                  </div>
                ))}
             </div>
           </div>

           <div className="lg:col-span-1 space-y-6">
              <div className="card border-primary/20 bg-primary/5 p-6 border-dashed">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Sync Insights
                </h3>
                <p className="text-[10px] text-zinc-300 leading-relaxed font-bold">
                  Matches are globally synced via RapidAPI. If a match is missing, use manual override.
                </p>
                <div className="mt-6 flex flex-col gap-2">
                  <span className="text-[10px] text-zinc-600 font-black uppercase">RapidAPI Call Status:</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[12%]" />
                    </div>
                    <span className="text-[10px] font-black">12/100</span>
                  </div>
                </div>
              </div>

              <div className="card border-zinc-800 bg-zinc-900 p-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-6">Manual Add Match</h3>
                <form className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">Team A Name</label>
                      <input type="text" className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-xs outline-none focus:border-primary" placeholder="e.g. CSK" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">Team B Name</label>
                      <input type="text" className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-xs outline-none focus:border-primary" placeholder="e.g. MI" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">Date & Time</label>
                      <input type="datetime-local" className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-xs outline-none focus:border-primary text-zinc-400" />
                   </div>
                   <button className="w-full py-4 btn-primary text-xs uppercase tracking-widest font-black mt-2">
                     Add Match
                   </button>
                </form>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
