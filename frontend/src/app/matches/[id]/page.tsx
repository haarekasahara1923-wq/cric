"use client";

import { useState } from "react";
import { 
  ChevronLeft, 
  Wallet, 
  Zap, 
  Clock, 
  Users, 
  TrendingUp, 
  CheckCircle2 
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const [betAmount, setBetAmount] = useState<number>(500);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [selectedToss, setSelectedToss] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = (type: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`Prediction placed for ${type}! Success.`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:text-white transition-colors">
          <ChevronLeft /> <span className="font-bold uppercase tracking-tighter">Matches</span>
        </Link>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-primary/20">
          <Wallet className="w-4 h-4 text-primary" />
          <span className="font-bold text-white text-sm">10,000 pts</span>
        </div>
      </div>

      {/* Match Card */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="card bg-gradient-to-b from-[#111] to-black border-zinc-800 p-8 flex flex-col items-center">
          <div className="flex items-center gap-4 text-xs font-black text-primary px-3 py-1 bg-primary/10 rounded-full mb-6 uppercase tracking-widest">
            <Zap className="w-3 h-3 animate-pulse" /> LIVE NOW
          </div>

          <div className="w-full flex items-center justify-between px-4 md:px-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-zinc-900 border border-zinc-800 p-4 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/1200px-Chennai_Super_Kings_Logo.svg.png" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-2xl font-black italic tracking-tighter">CSK</h2>
            </div>

            <div className="flex flex-col items-center flex-1">
              <span className="text-5xl md:text-7xl font-black text-primary/10 select-none">VS</span>
              <div className="mt-4 flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 text-zinc-500 font-bold text-xs uppercase tracking-tighter">
                  <Clock className="w-3 h-3" /> Ends in 02:24:45
                </div>
                <div className="text-xs text-zinc-700 font-medium">MA Chidambaram Stadium, Chennai</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-zinc-900 border border-zinc-800 p-4 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/1200px-Mumbai_Indians_Logo.svg.png" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-2xl font-black italic tracking-tighter">MI</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Sections */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Prediction Box */}
        <div className="lg:col-span-2 space-y-8">
          {/* Winner Prediction */}
          <div className="card p-6 bg-zinc-900 border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white italic tracking-tighter">MATCH WINNER</h3>
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 bg-white/5 px-2 py-1 rounded-full uppercase tracking-widest font-bold">
                <Users className="w-3 h-3" /> 2.4k Predicted
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setSelectedWinner("CSK")}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between group ${selectedWinner === "CSK" ? "bg-primary border-primary" : "bg-black border-zinc-800 hover:border-primary/50"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full border border-current flex items-center justify-center p-0.5">
                    {selectedWinner === "CSK" && <div className="h-full w-full bg-black rounded-full" />}
                  </div>
                  <span className={`font-black uppercase tracking-widest text-sm ${selectedWinner === "CSK" ? "text-black" : "text-white"}`}>CSK</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedWinner === "CSK" ? "text-black/60" : "text-primary group-hover:bg-primary group-hover:text-black"} px-2 py-1 bg-primary/10 rounded ml-2`}>1.85x</span>
              </button>

              <button 
                onClick={() => setSelectedWinner("MI")}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between group ${selectedWinner === "MI" ? "bg-primary border-primary" : "bg-black border-zinc-800 hover:border-primary/50"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full border border-current flex items-center justify-center p-0.5">
                    {selectedWinner === "MI" && <div className="h-full w-full bg-black rounded-full" />}
                  </div>
                  <span className={`font-black uppercase tracking-widest text-sm ${selectedWinner === "MI" ? "text-black" : "text-white"}`}>MI</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedWinner === "MI" ? "text-black/60" : "text-primary group-hover:bg-primary group-hover:text-black"} px-2 py-1 bg-primary/10 rounded ml-2`}>2.10x</span>
              </button>
            </div>
          </div>

          {/* Toss Prediction */}
          <div className="card p-6 bg-zinc-900 border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white italic tracking-tighter">TOSS WINNER</h3>
              <div className="text-[10px] text-primary font-black uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-full">LOCKED IN 1Hr</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 opacity-75">
              <button 
                onClick={() => setSelectedToss("CSK")}
                className={`p-4 rounded-xl border border-zinc-800 bg-black cursor-not-allowed`}
              >
                <span className="font-black uppercase tracking-widest text-sm text-zinc-400">CSK</span>
              </button>
              <button 
                className={`p-4 rounded-xl border border-zinc-800 bg-black cursor-not-allowed`}
              >
                <span className="font-black uppercase tracking-widest text-sm text-zinc-400">MI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Prediction Input Box */}
        <div className="lg:col-span-1">
          <div className="card p-6 bg-zinc-900 border-primary/20 sticky top-24">
            <h3 className="text-lg font-black text-primary mb-6 flex items-center gap-2 italic uppercase tracking-tighter">
              <TrendingUp className="w-4 h-4" /> Place Your Play
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Points Entry</label>
                  <span className="text-xs font-black text-primary">{betAmount.toLocaleString()} PTS</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="10000" 
                  step="100"
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseInt(e.target.value))}
                  className="w-full accent-primary bg-zinc-800 h-2 rounded-lg"
                />
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {[500, 1000, 2500, 5000].map((amt) => (
                    <button 
                      key={amt} 
                      onClick={() => setBetAmount(amt)}
                      className="text-[10px] font-black border border-zinc-800 hover:border-primary/50 text-zinc-400 hover:text-primary p-1 rounded transition-all"
                    >
                      {amt >= 1000 ? `${amt/1000}k` : amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded-xl border border-zinc-800/50 space-y-3">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-zinc-500 uppercase">Est. Payout</span>
                  <span className="text-white">{(betAmount * (selectedWinner === "CSK" ? 1.85 : 2.10)).toLocaleString()} PTS</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-zinc-500 uppercase">Balance After</span>
                  <span className="text-zinc-400">{(10000 - betAmount).toLocaleString()} PTS</span>
                </div>
              </div>

              <button 
                disabled={!selectedWinner || loading}
                onClick={() => handlePredict("Match Winner")}
                className="btn-primary w-full py-4 text-sm tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? <span className="animate-spin text-lg">◌</span> : (
                  <>
                    CONFIRM PREDICTION
                    <CheckCircle2 className="w-4 h-4 hidden group-hover:block" />
                  </>
                )}
              </button>
            </div>

            <p className="mt-6 text-[8px] text-zinc-600 text-center uppercase tracking-widest font-bold">
              Predict responsibly. Points are non-redeemable. 18+ Only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
