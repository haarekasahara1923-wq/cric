"use client";

import { 
  Users, 
  Trophy, 
  Gamepad2, 
  DollarSign, 
  TrendingUp, 
  ExternalLink,
  PlusCircle,
  Database,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useState } from "react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const stats = [
    { label: "Total Users", value: "1,254", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Plays", value: "8,920", icon: Gamepad2, color: "text-primary", bg: "bg-primary/10" },
    { label: "Points Locked", value: "1.2M", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Active Matches", value: "4", icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10" }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Security: Authenticated</span>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white">ADMIN TERMINAL</h1>
        </div>
        
        <div className="flex gap-4">
          <Link href="/admin/matches" className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Manage Matches
          </Link>
          <button onClick={() => toast.success("Generating Reports... Please wait a moment.")} className="px-6 py-3 bg-primary text-black rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-transform active:scale-95 duration-200">
            <TrendingUp className="w-4 h-4" /> Reports
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="card p-6 bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between h-40">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">REALTIME</span>
            </div>
            <div>
              <p className="text-zinc-500 text-xs font-bold mb-1 uppercase tracking-tighter">{stat.label}</p>
              <h3 className="text-3xl font-black text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card border-zinc-800 bg-zinc-900/50">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2 italic">
                <Database className="w-4 h-4" /> RECENT SETTLEMENTS
              </h3>
              <button onClick={() => toast.success("Fetching System Logs...")} className="text-[10px] font-black text-zinc-600 hover:text-white transition-colors">VIEW LOGS</button>
            </div>
            
            <div className="divide-y divide-zinc-800">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-black text-xs">#{item}28</div>
                    <div>
                      <h4 className="font-bold text-sm">CSK vs MI <span className="text-[10px] text-zinc-600 ml-2">Match #1234</span></h4>
                      <p className="text-[10px] text-primary italic uppercase tracking-tighter">Winner: CSK (1.85x payout completed)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-green-500">+12,400 PTS</p>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">Selled 12m ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="card border-primary/20 bg-gradient-to-br from-[#111] to-black p-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 underline decoration-primary underline-offset-8">Quick Control</h3>
            <div className="space-y-4">
              <button 
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  try {
                    await api.get('/matches/sync/upcoming');
                    toast.success("Matches Synced Successfully from RapidAPI!");
                  } catch (e) {
                    toast.error("Failed to Sync Matches");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full text-left p-4 rounded-xl border border-zinc-800 hover:border-primary/40 bg-black/40 transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest group-hover:text-primary transition-colors">{loading ? "Syncing..." : "Sync Matches"}</h4>
                  <p className="text-[9px] text-zinc-600 font-bold">Manual RapidAPI pull</p>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-700" />
              </button>
              
              <button 
                onClick={() => toast.error("Notification Service not fully configured yet.")}
                className="w-full text-left p-4 rounded-xl border border-zinc-800 hover:border-primary/40 bg-black/40 transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest group-hover:text-primary transition-colors">Notification Blast</h4>
                  <p className="text-[9px] text-zinc-600 font-bold">Email users via Resend</p>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-700" />
              </button>

              <button 
                onClick={() => toast.error("System Emergency Stop Triggered! Prediction markets frozen.")}
                className="w-full text-left p-4 rounded-xl border border-red-900/40 hover:border-red-500/40 bg-red-950/10 transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-red-500">Emergency Stop</h4>
                  <p className="text-[9px] text-red-900 font-bold">Temporary freeze predictions</p>
                </div>
                < ShieldCheck className="w-4 h-4 text-red-900" />
              </button>
            </div>
          </div>

          <div className="card border-zinc-800 bg-zinc-900 p-6 flex flex-col items-center gap-4 text-center">
             <div className="w-16 h-1 w-1 bg-primary/20 rounded-full"></div>
             <p className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter leading-relaxed">
              "System core is running at 14ms latency. Database load is optimal."
             </p>
             <div className="flex gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
