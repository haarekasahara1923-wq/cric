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
  Activity,
  X
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
  const [selectedOdds, setSelectedOdds] = useState<number | null>(null);
  const [selectedPredictionId, setSelectedPredictionId] = useState<string | null>(null);
  const [marketTab, setMarketTab] = useState('EXCHANGE');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const res = await api.get('/auth/me');
      setUserData(res.data);
    } catch (e) {}
  };

  // Fetch match data every 5 seconds for live odds
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await api.get(`/matches/${params.id}`);
        setMatch(response.data);
      } catch (error) {
        if (loading) router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
    fetchUserData();
    const interval = setInterval(fetchMatch, 5000);
    return () => clearInterval(interval);
  }, [params.id, router, loading]);

  const placeBet = async () => {
    if (!selectedOption || !selectedPredictionId || !selectedType || !selectedOdds) return;
    setSubmitting(true);
    try {
      await api.post("/matches/bet/place", {
        predictionId: selectedPredictionId,
        option: selectedOption,
        amount: betAmount,
        type: selectedType
      });
      
      setSubmitting(false);
      toast.success(`Order Placed: ${selectedOption} @ ${selectedOdds}`);
      setSelectedOption(null);
      setSelectedType(null);
      fetchUserData(); // Refresh balance
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to place bet");
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!match) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
        <Activity className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Match Not Found</h2>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-6">This fixture may have been removed or is temporarily unavailable.</p>
        <Link href="/dashboard" className="px-8 py-3 bg-primary text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-accent transition-all">Back to Dashboard</Link>
      </div>
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
          <span className="font-black text-lg italic tracking-tighter text-primary uppercase">{match.team_a} <span className="text-white text-xs whitespace-nowrap px-2">VS</span> {match.team_b}</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex flex-col items-end px-4 border-r border-[#2A2A2A]">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1">Exposure</span>
            <span className="text-pink-400 font-black text-sm leading-none">0 <span className="text-[9px]">PTS</span></span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1">Balance</span>
            <span className="text-primary font-black text-sm leading-none">{userData?.points_balance?.toLocaleString() || '0'} <span className="text-[9px]">PTS</span></span>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6">
        {/* Main Markets Section */}
        <div className="lg:col-span-8 space-y-4">
          {/* Match Status Card */}
          <div className="card bg-gradient-to-r from-[#1A1A1A] to-[#222] border-zinc-800 p-6 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={80} /></div>
             <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                <div className="text-center w-24">
                   <div className="text-[10px] font-bold text-text-muted uppercase mb-2 truncate">{match.team_a}</div>
                   <div className="text-2xl font-black italic">-- / -</div>
                   <div className="text-[10px] text-zinc-600 font-bold uppercase">(0.0)</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-black text-primary text-[10px] ring-1 ring-primary/20">VS</div>
                    <span className="text-[8px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded font-black mt-2 animate-pulse">{match.status}</span>
                </div>
                <div className="text-center w-24">
                   <div className="text-[10px] font-bold text-text-muted uppercase mb-2 truncate">{match.team_b}</div>
                   <div className="text-2xl font-black italic">Yet to Bat</div>
                   <div className="text-[10px] text-zinc-600 font-bold uppercase">(0.0)</div>
                </div>
             </div>
             <div className="mt-8 md:mt-0 p-4 bg-black/40 border border-zinc-800 rounded-xl text-center min-w-[140px]">
                <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Venue Info</div>
                <div className="text-xs font-black text-primary uppercase line-clamp-1">{match.venue || 'International Ground'}</div>
                <div className="text-[8px] text-zinc-600 font-bold mt-1 uppercase tracking-tighter">Live from {new Date(match.start_time).toLocaleDateString()}</div>
             </div>
          </div>

          {/* Market Tabs */}
          <div className="flex gap-2 bg-[#1A1A1A] p-1.5 rounded-xl border border-[#2A2A2A] w-fit">
             {['EXCHANGE', 'BOOKMAKER', 'FANCY'].map((cat) => (
               <button 
                 key={cat}
                 onClick={() => setMarketTab(cat)}
                 className={`px-6 py-2.5 font-black text-[10px] rounded-lg uppercase tracking-widest transition-all ${marketTab === cat ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'}`}
               >
                 {cat}
               </button>
             ))}
          </div>

          {/* Dynamic Markets List */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {match.predictions
              ?.filter((p: any) => p.category === marketTab)
              .map((pred: any) => {
              const odds = (pred.odds as any) || {};
              return (
                <div key={pred.id} className="card bg-[#1A1A1A] border-[#2A2A2A] overflow-hidden group hover:border-[#333]">
                  <div className="bg-[#222] px-4 py-3 border-b border-[#2A2A2A] flex flex-col md:flex-row justify-between items-start md:items-center group-hover:bg-[#282828] transition-colors gap-2">
                     <div className="flex items-center gap-3">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <h3 className="text-[11px] font-black italic tracking-tight text-white uppercase">{pred.question}</h3>
                     </div>
                     <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        <div className="w-16 text-center text-[7px] font-black text-blue-400 uppercase tracking-tighter leading-tight">Back<br/>(Win/Buy)</div>
                        <div className="w-16 text-center text-[7px] font-black text-pink-400 uppercase tracking-tighter leading-tight">Lay<br/>(Lost/Sell)</div>
                     </div>
                  </div>
                  
                  <div className="divide-y divide-[#2A2A2A]">
                    {pred.options.map((opt: string) => (
                      <div key={opt} className="flex flex-col md:flex-row items-start md:items-center justify-between p-3.5 hover:bg-white/5 transition-all gap-3">
                         <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 border border-zinc-700"></div>
                            <span className="font-black text-[10px] md:text-[11px] uppercase tracking-tighter text-zinc-300 truncate max-w-[100px] md:max-w-none">{opt}</span>
                         </div>
                         <div className="flex gap-2 w-full md:w-auto justify-end">
                            <button 
                              onClick={() => { 
                                setSelectedOption(opt); 
                                setSelectedType('BACK'); 
                                setSelectedPredictionId(pred.id); 
                                setSelectedOdds(odds[opt]?.back || 1.85);
                              }}
                              className={`odds-box-back w-full md:w-16 h-12 flex flex-col items-center justify-center transition-all ${selectedOption === opt && selectedPredictionId === pred.id && selectedType === 'BACK' ? 'ring-2 ring-white scale-105' : 'hover:scale-105'}`}
                            >
                               <div className="text-[13px] font-black">{odds[opt]?.back || '1.85'}</div>
                               <div className="text-[7px] opacity-70 font-bold mt-0.5">{(Math.random() * 50).toFixed(1)}k</div>
                            </button>
                            <button 
                              onClick={() => { 
                                setSelectedOption(opt); 
                                setSelectedType('LAY'); 
                                setSelectedPredictionId(pred.id); 
                                setSelectedOdds(odds[opt]?.lay || 1.87);
                              }}
                              className={`odds-box-lay w-full md:w-16 h-12 flex flex-col items-center justify-center transition-all ${selectedOption === opt && selectedPredictionId === pred.id && selectedType === 'LAY' ? 'ring-2 ring-white scale-105' : 'hover:scale-105'}`}
                            >
                               <div className="text-[13px] font-black">{odds[opt]?.lay || '1.87'}</div>
                               <div className="text-[7px] opacity-70 font-bold mt-0.5">{(Math.random() * 30).toFixed(1)}k</div>
                            </button>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar - Bet Slip */}
        <div className="lg:col-span-4 space-y-4">
           <div className="card bg-[#1A1A1A] border-primary/10 p-0 overflow-hidden sticky top-24 shadow-2xl">
              <div className="bg-primary text-black font-black text-xs py-4 px-5 uppercase tracking-widest flex justify-between items-center">
                 Bet Slip
                 <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
              </div>
              
              <div className="p-6">
                 {selectedOption ? (
                   <div className="space-y-6 animate-in slide-in-from-right duration-300">
                      <div className={`p-4 rounded-xl border-l-4 ${selectedType === 'BACK' ? 'bg-blue-400/10 border-blue-400' : 'bg-pink-400/10 border-pink-400'}`}>
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">{selectedType === 'BACK' ? 'Back (Buy)' : 'Lay (Sell)'}</span>
                            <button onClick={() => setSelectedOption(null)} className="text-zinc-600 hover:text-white transition-colors"><X size={16}/></button>
                         </div>
                         <div className="text-sm font-black text-white uppercase tracking-tight mb-2">{selectedOption}</div>
                         <div className="flex items-center gap-3">
                             <div className="bg-black/40 px-3 py-1 rounded-lg border border-zinc-800">
                                <span className="text-[8px] font-bold text-zinc-500 uppercase mr-2">Odds</span>
                                <span className="text-primary font-black text-xs">{selectedOdds}</span>
                             </div>
                             <div className="bg-black/40 px-3 py-1 rounded-lg border border-zinc-800">
                                <span className="text-[8px] font-bold text-zinc-500 uppercase mr-2">Market</span>
                                <span className="text-white font-black text-[9px] uppercase tracking-tighter">Exchange</span>
                             </div>
                         </div>
                      </div>

                      <div className="space-y-3">
                         <div className="flex justify-between items-end">
                            <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Stake Amount</label>
                            <span className="text-[10px] font-black text-zinc-700 italic">Min: 100 | Max: 5.0L</span>
                         </div>
                         <div className="relative">
                            <input 
                              type="number" 
                              value={betAmount}
                              onChange={(e) => setBetAmount(parseInt(e.target.value))}
                              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-4 text-white font-black text-2xl focus:border-primary outline-none transition-all placeholder:text-zinc-800"
                              placeholder="0"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                               <div className="h-4 w-[1px] bg-zinc-800"></div>
                               <span className="text-primary font-black text-sm italic tracking-tighter">PTS</span>
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {[100, 500, 1000, 5000].map(amt => (
                          <button key={amt} onClick={() => setBetAmount(amt)} className="bg-[#2A2A2A] hover:bg-zinc-800 border border-[#333] hover:border-primary/40 text-[10px] font-black py-2.5 rounded-lg transition-all text-zinc-400 hover:text-white">{amt >= 1000 ? `${amt/1000}K` : amt}</button>
                        ))}
                      </div>

                      <div className="bg-black/50 p-5 rounded-2xl border border-zinc-900 space-y-3">
                         <div className="flex justify-between text-[10px] font-black">
                            <span className="text-zinc-600 uppercase tracking-widest">Est. Profit</span>
                            <span className="text-green-400">+{Math.floor(betAmount * (selectedOdds || 1) - betAmount).toLocaleString()} PTS</span>
                         </div>
                         <div className="flex justify-between text-[10px] font-black border-t border-zinc-800/50 pt-3">
                            <span className="text-zinc-600 uppercase tracking-widest">Total Liability</span>
                            <span className="text-white">{betAmount.toLocaleString()} PTS</span>
                         </div>
                      </div>

                      <button 
                        disabled={submitting}
                        onClick={placeBet}
                        className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all relative overflow-hidden group ${submitting ? 'bg-zinc-800 text-zinc-600' : 'bg-primary text-black hover:scale-[1.01] active:scale-95 shadow-2xl shadow-primary/20'}`}
                      >
                        {submitting ? 'Authenticating...' : 'Confirm Order'}
                        {!submitting && <div className="absolute top-0 right-0 p-2 opacity-5"><Zap size={40}/></div>}
                      </button>
                   </div>
                 ) : (
                   <div className="text-center py-20 px-8">
                      <div className="w-16 h-16 bg-zinc-900/50 rounded-3xl border border-zinc-800 flex items-center justify-center mx-auto mb-6">
                         <Activity className="w-8 h-8 text-zinc-800" />
                      </div>
                      <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] leading-relaxed">Select an active price from the market to build your order</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Quick History Overlay Style */}
           <div className="card bg-[#1A1A1A] border-[#2A2A2A] p-5">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-[10px] font-black text-white italic uppercase tracking-widest flex items-center gap-2">
                    <History className="w-4 h-4 text-primary" /> Recent Bets
                 </h3>
                 <span className="text-[8px] bg-zinc-900 text-zinc-500 font-bold px-2 py-0.5 rounded">AUTO-SETTLE</span>
              </div>
              <div className="pt-4 border-t border-[#2A2A2A]">
                 <p className="text-[9px] font-bold text-zinc-700 uppercase text-center italic">No settled orders found in last 24h.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
