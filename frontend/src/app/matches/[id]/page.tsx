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

      <div className="max-w-[1400px] mx-auto p-2 sm:p-4">
        {/* Main Markets Section */}
        <div className="space-y-4 max-w-7xl mx-auto">
          <div className="card bg-gradient-to-r from-[#1A1A1A] to-[#222] border-zinc-800 p-6 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={80} /></div>
             <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                <div className="text-center w-24">
                   <div className="text-[10px] font-bold text-text-muted uppercase mb-2 truncate">{match.team_a}</div>
                   <div className="text-2xl font-black italic">
                     {match.scorecard?.[0] ? `${match.scorecard[0].r}/${match.scorecard[0].w}` : '-- / -'}
                   </div>
                   <div className="text-[10px] text-zinc-600 font-bold uppercase">
                     ({match.scorecard?.[0] ? `${match.scorecard[0].o} ov` : '0.0'})
                   </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-black text-primary text-[10px] ring-1 ring-primary/20">VS</div>
                    <span className={`text-[8px] px-2 py-0.5 rounded font-black mt-2 uppercase ${match.status === 'LIVE' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-primary/20 text-primary'}`}>{match.status}</span>
                </div>
                <div className="text-center w-24">
                   <div className="text-[10px] font-bold text-text-muted uppercase mb-2 truncate">{match.team_b}</div>
                   <div className="text-2xl font-black italic">
                     {match.scorecard?.[1] ? `${match.scorecard[1].r}/${match.scorecard[1].w}` : (match.scorecard?.[0] ? 'Yet to Bat' : '-- / -')}
                   </div>
                   <div className="text-[10px] text-zinc-600 font-bold uppercase">
                     ({match.scorecard?.[1] ? `${match.scorecard[1].o} ov` : '0.0'})
                   </div>
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
          <div className="space-y-6">
            {match.predictions
              ?.filter((p: any) => p.category === marketTab)
              .length === 0 ? (
                <div className="text-center py-20 bg-[#1A1A1A] rounded-[2rem] border border-dashed border-zinc-800">
                   <Activity className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                   <h3 className="text-sm font-black text-white italic uppercase tracking-tighter">No markets available in {marketTab}</h3>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                  {match.predictions
                    ?.filter((p: any) => p.category === marketTab)
                    .map((pred: any, idx: number) => {
                    const odds = (pred.odds as any) || {};
                    const isEven = idx % 2 === 0;
                    
                    return (
                      <div 
                        key={pred.id} 
                        className={`relative overflow-hidden flex flex-col justify-between group transition-all duration-300 rounded-xl sm:rounded-2xl border ${isEven ? 'bg-[#1A1A1A] border-zinc-800' : 'bg-[#151515] border-primary/20'}`}
                      >
                        <div className="px-2 py-2 sm:px-3 sm:py-3 border-b border-white/5 flex flex-col justify-center items-center text-center relative z-10 bg-black/20">
                           <h3 className="text-[9px] sm:text-[11px] font-black italic tracking-wide text-white uppercase leading-tight line-clamp-2">{pred.question}</h3>
                        </div>
                        
                        <div className="flex-1 divide-y divide-white/5 relative z-10">
                          {pred.options.map((opt: string) => (
                            <div key={opt} className="flex flex-col items-center justify-center p-2 sm:p-3 hover:bg-primary/5 transition-all group/opt relative">
                               <div className="text-[9px] sm:text-[10px] font-black uppercase text-zinc-400 group-hover/opt:text-white transition-colors mb-2 text-center w-full line-clamp-1" title={opt}>{opt}</div>
                               <div className="flex gap-1 w-full justify-center">
                                  <button 
                                    onClick={() => { 
                                      if (selectedPredictionId === pred.id && selectedOption === opt && selectedType === 'BACK') {
                                        setSelectedPredictionId(null); setSelectedOption(null);
                                      } else {
                                        setSelectedOption(opt); setSelectedType('BACK'); setSelectedPredictionId(pred.id); setSelectedOdds(odds[opt]?.back || 1.85);
                                      }
                                    }}
                                    className={`relative overflow-hidden flex-1 h-9 sm:h-10 flex flex-col items-center justify-center rounded-lg border transition-all ${selectedOption === opt && selectedPredictionId === pred.id && selectedType === 'BACK' ? 'bg-blue-500 border-white scale-105 shadow-md shadow-blue-500/20 z-10' : 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500'}`}
                                  >
                                     <div className={`text-[11px] sm:text-[13px] font-black ${selectedOption === opt && selectedPredictionId === pred.id && selectedType === 'BACK' ? 'text-white' : 'text-blue-400'}`}>{odds[opt]?.back || '1.85'}</div>
                                     <div className={`text-[6px] sm:text-[7px] font-bold uppercase ${selectedOption === opt && selectedPredictionId === pred.id && selectedType === 'BACK' ? 'text-blue-100' : 'text-blue-500/50'}`}>Buy</div>
                                  </button>
                                  <button 
                                    onClick={() => { 
                                      if (selectedPredictionId === pred.id && selectedOption === opt && selectedType === 'LAY') {
                                        setSelectedPredictionId(null); setSelectedOption(null);
                                      } else {
                                        setSelectedOption(opt); setSelectedType('LAY'); setSelectedPredictionId(pred.id); setSelectedOdds(odds[opt]?.lay || 1.87);
                                      }
                                    }}
                                    className={`relative overflow-hidden flex-1 h-9 sm:h-10 flex flex-col items-center justify-center rounded-lg border transition-all ${selectedOption === opt && selectedPredictionId === pred.id && selectedType === 'LAY' ? 'bg-accent border-white scale-105 shadow-md shadow-accent/20 z-10' : 'bg-accent/10 border-accent/20 hover:bg-accent/20 hover:border-accent'}`}
                                  >
                                     <div className={`text-[11px] sm:text-[13px] font-black ${selectedOption === opt && selectedPredictionId === pred.id && selectedType === 'LAY' ? 'text-white' : 'text-accent'}`}>{odds[opt]?.lay || '1.87'}</div>
                                     <div className={`text-[6px] sm:text-[7px] font-bold uppercase ${selectedOption === opt && selectedPredictionId === pred.id && selectedType === 'LAY' ? 'text-accent/20' : 'text-accent/50'}`}>Sell</div>
                                  </button>
                               </div>
                            </div>
                          ))}
                        </div>

                        {/* Aviator-style Inline Bet Slip */}
                        {selectedPredictionId === pred.id && (
                          <div className="bg-[#050505] border-t-2 border-primary/50 p-2 animate-in slide-in-from-top-2 duration-200">
                             <div className="flex justify-between items-center mb-2 px-1">
                               <span className="text-[8px] text-zinc-500 font-bold uppercase truncate max-w-[50%]">{selectedOption} ({selectedType})</span>
                               <span className="text-[8px] text-green-400 font-black">+ {Math.floor(betAmount * (selectedOdds || 1) - betAmount)} PTS</span>
                             </div>
                             <div className="flex flex-col gap-2">
                                <div className="flex gap-2 h-8">
                                   <input 
                                     type="number" 
                                     value={betAmount || ""}
                                     onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
                                     placeholder="Stake"
                                     className="w-1/2 bg-[#1A1A1A] border border-zinc-800 rounded px-2 text-[11px] font-black text-white text-center rounded outline-none focus:border-primary/50 transition-colors"
                                   />
                                   <button 
                                     disabled={submitting} 
                                     onClick={placeBet} 
                                     className="w-1/2 bg-primary text-white rounded font-black text-[9px] uppercase hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                                   >
                                      {submitting ? "..." : "Confirm"}
                                   </button>
                                </div>
                                <div className="flex gap-1 justify-between">
                                  {[100, 500, 1000, 5000].map(amt => (
                                    <button 
                                      key={amt} 
                                      onClick={() => setBetAmount(amt)} 
                                      className="flex-1 bg-zinc-800/80 hover:bg-zinc-700 text-[8px] font-bold py-1.5 rounded-sm text-zinc-300 transition-colors"
                                    >
                                      {amt >= 1000 ? amt/1000 + 'k' : amt}
                                    </button>
                                  ))}
                                </div>
                             </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
