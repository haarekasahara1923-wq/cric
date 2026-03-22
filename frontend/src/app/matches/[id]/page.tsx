"use client";

import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Wallet, 
  Zap, 
  Clock, 
  Users, 
  TrendingUp, 
  CheckCircle2,
  Info,
  History,
  Activity
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const [match, setMatch] = useState<any>(null);
  const [betAmount, setBetAmount] = useState<number>(500);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'BACK' | 'LAY' | null>(null);
  const [selectedPredictionId, setSelectedPredictionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await api.get(`/matches/${params.id}`);
        setMatch(response.data);
      } catch (error) {
        toast.error("Match not found");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [params.id, router]);

  const placeBet = async () => {
    if (!selectedOption || !selectedPredictionId || !selectedType) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(`Bet Placed: ${selectedOption} @ 1.85 (${selectedType})`);
      setSelectedOption(null);
      setSelectedType(null);
    }, 1000);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Satyam77 Header */}
      <header className="h-16 bg-[#1A1A1A] border-b border-[#2A2A2A] sticky top-0 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-text-muted hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <span className="font-black text-lg italic tracking-tighter text-primary uppercase">{match.team_a} <span className="text-white text-xs">VS</span> {match.team_b}</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end px-4 border-r border-[#2A2A2A]">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1">Exposure</span>
            <span className="text-pink-400 font-black text-sm leading-none">0 <span className="text-[9px]">PTS</span></span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1">Balance</span>
            <span className="text-primary font-black text-sm leading-none">125,450 <span className="text-[9px]">PTS</span></span>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Main Markets Section */}
        <div className="lg:col-span-8 space-y-4">
          {/* Real-time score mock */}
          <div className="card bg-gradient-to-r from-[#1A1A1A] to-[#222] border-zinc-800 p-6 flex flex-col md:flex-row items-center justify-between">
             <div className="flex items-center gap-6">
                <div className="text-center">
                   <div className="text-xs font-bold text-text-muted uppercase mb-1">{match.team_a}</div>
                   <div className="text-2xl font-black italic">-- / -</div>
                   <div className="text-[10px] text-zinc-600 font-bold uppercase">(0.0)</div>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-black text-primary text-xs">VS</div>
                <div className="text-center">
                   <div className="text-xs font-bold text-text-muted uppercase mb-1">{match.team_b}</div>
                   <div className="text-2xl font-black italic">Yet to Bat</div>
                   <div className="text-[10px] text-zinc-600 font-bold uppercase">(0.0)</div>
                </div>
             </div>
             <div className="mt-4 md:mt-0 px-4 py-2 bg-black border border-zinc-800 rounded-lg text-center">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ground Info</div>
                <div className="text-xs font-black text-primary uppercase">{match.venue || 'TBA'}</div>
                <div className="text-[8px] text-zinc-600 font-bold mt-1 uppercase tracking-tighter">Day/Night Match</div>
             </div>
          </div>

          {/* Market Header Tab */}
          <div className="flex gap-2 bg-[#1A1A1A] p-1 rounded-lg border border-[#2A2A2A]">
             <button className="px-6 py-2 bg-primary text-black font-black text-[10px] rounded-md shadow-lg shadow-primary/20 uppercase">Match Odds</button>
             <button className="px-6 py-2 text-text-muted font-bold text-[10px] hover:text-white transition-all uppercase">Bookmaker</button>
             <button className="px-6 py-2 text-text-muted font-bold text-[10px] hover:text-white transition-all uppercase">Fancy</button>
          </div>

          {/* Markets List */}
          <div className="space-y-2">
            {match.predictions?.map((pred: any) => (
              <div key={pred.id} className="card bg-[#1A1A1A] border-[#2A2A2A] overflow-hidden">
                <div className="bg-[#252525] px-4 py-2 border-b border-[#2A2A2A] flex justify-between items-center">
                   <h3 className="text-[10px] font-black italic tracking-tighter text-white uppercase">{pred.question}</h3>
                   <div className="flex items-center gap-4 text-[9px] font-bold">
                      <span className="text-blue-400">Back</span>
                      <span className="text-pink-400">Lay</span>
                   </div>
                </div>
                
                <div className="divide-y divide-[#2A2A2A]">
                  {pred.options.map((opt: string) => (
                    <div key={opt} className="flex items-center justify-between p-3 hover:bg-white/5 transition-all">
                       <span className="font-bold text-xs uppercase tracking-tighter">{opt}</span>
                       <div className="flex gap-2">
                          <button 
                            onClick={() => { setSelectedOption(opt); setSelectedType('BACK'); setSelectedPredictionId(pred.id); }}
                            className={`odds-box-back ${selectedOption === opt && selectedPredictionId === pred.id && selectedType === 'BACK' ? 'ring-2 ring-white' : ''}`}
                          >
                             <div className="text-xs">1.85</div>
                             <div className="text-[7px] opacity-70 font-bold mt-0.5">24.5k</div>
                          </button>
                          <button 
                            onClick={() => { setSelectedOption(opt); setSelectedType('LAY'); setSelectedPredictionId(pred.id); }}
                            className={`odds-box-lay ${selectedOption === opt && selectedPredictionId === pred.id && selectedType === 'LAY' ? 'ring-2 ring-white' : ''}`}
                          >
                             <div className="text-xs">1.92</div>
                             <div className="text-[7px] opacity-70 font-bold mt-0.5">18.2k</div>
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Bet Slip */}
        <div className="lg:col-span-4 space-y-6">
           <div className="card bg-[#1A1A1A] border-primary/20 p-0 overflow-hidden sticky top-24 shadow-2xl">
              <div className="bg-primary text-black font-black text-xs py-3 px-4 uppercase tracking-widest flex justify-between items-center">
                 Bet Slip
                 <Activity className="w-4 h-4" />
              </div>
              
              <div className="p-6">
                 {selectedOption ? (
                   <div className="space-y-6 animate-in slide-in-from-right duration-300">
                      <div className={`p-4 rounded-xl border-l-4 ${selectedType === 'BACK' ? 'bg-blue-400/10 border-blue-400' : 'bg-pink-400/10 border-pink-400'}`}>
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black text-white/60 uppercase">{selectedType === 'BACK' ? 'Back (Buy)' : 'Lay (Sell)'}</span>
                            <button onClick={() => setSelectedOption(null)} className="text-xs text-text-muted hover:text-white"><X size={14}/></button>
                         </div>
                         <div className="text-sm font-black text-white uppercase tracking-tight">{selectedOption}</div>
                         <div className="text-[10px] font-bold text-primary mt-1">Odds: {selectedType === 'BACK' ? '1.85' : '1.92'}</div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Stake (Points)</label>
                         <div className="relative">
                            <input 
                              type="number" 
                              value={betAmount}
                              onChange={(e) => setBetAmount(parseInt(e.target.value))}
                              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white font-black text-lg focus:border-primary outline-none"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-black text-xs italic tracking-tighter">PTS</div>
                         </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {[100, 500, 1000, 5000].map(amt => (
                          <button key={amt} onClick={() => setBetAmount(amt)} className="bg-[#2A2A2A] hover:bg-zinc-700 text-[10px] font-black py-2 rounded transition-all">{amt >= 1000 ? `${amt/1000}K` : amt}</button>
                        ))}
                      </div>

                      <div className="bg-black/50 p-4 rounded-xl space-y-2">
                         <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-text-muted uppercase">Potential Profit</span>
                            <span className="text-green-400">{Math.floor(betAmount * 0.85).toLocaleString()} PTS</span>
                         </div>
                         <div className="flex justify-between text-[10px] font-bold border-t border-zinc-800 pt-2">
                            <span className="text-text-muted uppercase">Total Payout</span>
                            <span className="text-white">{(betAmount + Math.floor(betAmount * 0.85)).toLocaleString()} PTS</span>
                         </div>
                      </div>

                      <button 
                        disabled={submitting}
                        onClick={placeBet}
                        className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${submitting ? 'bg-zinc-800 text-zinc-600' : 'bg-primary text-black hover:scale-[1.02] shadow-xl shadow-primary/20'}`}
                      >
                        {submitting ? 'Processing...' : 'Place Bet'}
                      </button>
                   </div>
                 ) : (
                   <div className="text-center py-20">
                      <TrendingUp className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Click on odds to add a bet to your slip</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="card bg-[#1A1A1A] border-[#2A2A2A] p-6">
              <h3 className="text-xs font-black text-white italic uppercase tracking-tighter mb-4 flex items-center gap-2">
                 <History className="w-4 h-4" /> My Active Bets (0)
              </h3>
              <p className="text-[10px] font-bold text-zinc-600 uppercase text-center py-4">No active bets for this match.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

const X = ({ size, className }: { size?: number, className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
