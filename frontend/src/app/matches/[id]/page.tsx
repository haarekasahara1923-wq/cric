"use client";

import { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const [match, setMatch] = useState<any>(null);
  const [betAmount, setBetAmount] = useState<number>(500);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
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
        console.error('Failed to fetch match:', error);
        toast.error("Match not found");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [params.id, router]);

  const handlePredict = async () => {
    if (!selectedWinner || !selectedPredictionId) return;
    setSubmitting(true);
    try {
      // For now, mimic success. We'll add the real prediction POST next.
      setTimeout(() => {
        setSubmitting(false);
        toast.success(`Bet placed on ${selectedWinner}!`);
        setSelectedWinner(null);
        setSelectedPredictionId(null);
      }, 1000);
    } catch (error) {
      toast.error("Failed to place prediction");
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:text-white transition-colors">
          <ChevronLeft /> <span className="font-bold uppercase tracking-tighter">Matches</span>
        </Link>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-primary/20">
          <Wallet className="w-4 h-4 text-primary" />
          <span className="font-bold text-white text-sm">10,000 PTS</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Match Info Card */}
          <div className="card bg-zinc-900 border-zinc-800 p-8 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-primary px-3 py-1 bg-primary/10 rounded-full uppercase">
                <Zap className="w-3 h-3 animate-pulse" /> {match.status}
              </div>
            </div>

            <div className="w-full flex items-center justify-between px-4 md:px-12 mt-4">
              <div className="flex flex-col items-center gap-4">
                <img src={match.team_a_img || 'https://flagsapi.com/IN/flat/64.png'} alt={match.team_a} className="w-24 h-24 object-contain" />
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">{match.team_a}</h2>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-6xl font-black text-primary/5 select-none">VS</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase mt-2">{new Date(match.start_time).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
              </div>
              <div className="flex flex-col items-center gap-4">
                <img src={match.team_b_img || 'https://flagsapi.com/IN/flat/64.png'} alt={match.team_b} className="w-24 h-24 object-contain" />
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">{match.team_b}</h2>
              </div>
            </div>
          </div>

          {/* Dynamic Predictions List */}
          <div className="space-y-6">
            <h3 className="text-zinc-500 font-black text-xs uppercase tracking-[0.2em] mb-4">Available Markets</h3>
            {match.predictions?.length > 0 ? (
              match.predictions.map((pred: any) => (
                <div key={pred.id} className="card bg-zinc-900 border-zinc-800/50 p-6 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-black text-white italic tracking-tight text-sm uppercase">{pred.question}</h4>
                    <Users className="w-4 h-4 text-zinc-700" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {pred.options.map((opt: string) => (
                      <button 
                        key={opt}
                        onClick={() => {
                          setSelectedWinner(opt);
                          setSelectedPredictionId(pred.id);
                        }}
                        className={`p-4 rounded-xl border transition-all flex items-center justify-between group ${selectedWinner === opt && selectedPredictionId === pred.id ? "bg-primary border-primary" : "bg-black border-zinc-800 hover:border-primary/40"}`}
                      >
                        <span className={`text-[10px] font-black uppercase tracking-widest ${selectedWinner === opt && selectedPredictionId === pred.id ? "text-black" : "text-white"}`}>
                          {opt}
                        </span>
                        <span className={`text-[8px] font-black px-2 py-1 rounded ${selectedWinner === opt && selectedPredictionId === pred.id ? "bg-black/20 text-black" : "bg-primary/10 text-primary"}`}>
                          1.85x
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-zinc-950 rounded-2xl border border-zinc-900">
                <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">No predictions generated yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Betting Panel */}
        <div className="lg:col-span-1">
          <div className="card p-6 bg-zinc-900 border-primary/20 sticky top-24">
            <h3 className="text-lg font-black text-primary mb-6 flex items-center gap-2 italic uppercase tracking-tighter">
              <TrendingUp className="w-4 h-4" /> Place Play
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Points Entry</label>
                  <span className="text-xs font-black text-primary">{betAmount.toLocaleString()} PTS</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="5000" 
                  step="100"
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseInt(e.target.value))}
                  className="w-full accent-primary bg-zinc-800 h-1 rounded-lg"
                />
              </div>

              <div className="bg-black/40 p-4 rounded-xl border border-zinc-800/50 space-y-3">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-zinc-500 uppercase">Selection</span>
                  <span className="text-primary truncate ml-2">{selectedWinner || 'None'}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-zinc-500 uppercase">Est. Payout</span>
                  <span className="text-white">{(betAmount * 1.85).toLocaleString()} PTS</span>
                </div>
              </div>

              <button 
                disabled={!selectedWinner || submitting}
                onClick={handlePredict}
                className="btn-primary w-full py-4 text-xs font-black tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {submitting ? <span className="animate-spin">◌</span> : "CONFIRM PREDICTION"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
