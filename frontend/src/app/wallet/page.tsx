"use client";

import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  TrendingUp,
  CreditCard,
  Plus
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function WalletPage() {
  const [walletData, setWalletData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await api.get('/user/wallet');
        setWalletData(res.data);
      } catch (e) {} finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/dashboard" className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-primary transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Virtual Wallet</h1>
        </div>

        {/* Balance Card */}
        <div className="card bg-gradient-to-br from-[#111] via-[#0A0A0A] to-[#111] border-zinc-800 p-8 rounded-[2.5rem] mb-12 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <WalletIcon size={120} />
           </div>
           
           <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 block">Available Points</span>
              <div className="flex items-baseline gap-3 mb-8">
                 <h2 className="text-6xl font-black italic tracking-tighter text-primary">{walletData?.balance?.toLocaleString() || '0'}</h2>
                 <span className="text-sm font-black text-white/40 uppercase tracking-widest">PTS</span>
              </div>
              
              <div className="flex gap-4">
                 <div className="flex-1 bg-black/40 border border-zinc-800/50 p-4 rounded-2xl">
                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Total Payouts</span>
                    <span className="text-green-500 font-black text-sm italic">+15,200 <span className="text-[8px]">PTS</span></span>
                 </div>
                 <div className="flex-1 bg-black/40 border border-zinc-800/50 p-4 rounded-2xl">
                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Total Placed</span>
                    <span className="text-white font-black text-sm italic">42,500 <span className="text-[8px]">PTS</span></span>
                 </div>
              </div>
           </div>
        </div>

        {/* Action Quick Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
           {[
             { label: "Predict", icon: TrendingUp, href: "/dashboard" },
             { label: "Points Ledger", icon: History, active: true },
             { label: "Daily Bonus", icon: Plus, disabled: true },
             { label: "Withdraw (Points Only)", icon: CreditCard, disabled: true },
           ].map((item, i) => (
             <button 
               key={i} 
               disabled={item.disabled}
               className={`p-6 rounded-3xl border flex flex-col items-center gap-3 transition-all ${item.active ? 'bg-primary/10 border-primary text-primary' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
             >
                <item.icon size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
             </button>
           ))}
        </div>

        {/* Transaction History */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 italic">
                 <History className="w-3 h-3 text-primary" /> Points Ledger
              </h3>
              <span className="text-[9px] font-bold text-zinc-700 uppercase">showing last 20 entries</span>
           </div>

           <div className="space-y-3">
              {walletData?.transactions?.length === 0 ? (
                <div className="text-center py-20 bg-zinc-950/30 rounded-3xl border border-zinc-900">
                  <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">No transaction history found</p>
                </div>
              ) : (
                walletData?.transactions?.map((tx: any) => (
                  <div key={tx.id} className="card bg-[#0A0A0A] border-zinc-900 p-5 flex items-center justify-between group hover:border-zinc-800 transition-all">
                     <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${tx.type === 'CREDIT' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                           {tx.type === 'CREDIT' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div>
                           <h4 className="text-[11px] font-black uppercase tracking-tight text-white mb-0.5">{tx.reason}</h4>
                           <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(tx.created_at).toLocaleString()}</p>
                        </div>
                     </div>
                     <div className={`text-sm font-black italic tracking-tighter ${tx.type === 'CREDIT' ? 'text-green-500' : 'text-zinc-400'}`}>
                        {tx.type === 'CREDIT' ? '+' : '-'}{tx.amount.toLocaleString()} <span className="text-[9px]">PTS</span>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
