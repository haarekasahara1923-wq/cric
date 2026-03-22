"use client";

import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Trophy, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  HelpCircle,
  Plus,
  Clock,
  Trash2,
  List
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";

const PREDICTION_TEMPLATES = [
  { type: 'MATCH_WINNER', category: 'EXCHANGE', question: 'Who will win the match?', options: ['Team A', 'Team B'] },
  { type: 'TOSS_WINNER', category: 'EXCHANGE', question: 'Who will win the toss?', options: ['Team A', 'Team B'] },
  { type: 'TOP_BATSMAN', category: 'BOOKMAKER', question: 'Who will be the top batsman?', options: ['Batsman 1', 'Batsman 2', 'Batsman 3'] },
  { type: 'TOP_BOWLER', category: 'BOOKMAKER', question: 'Who will be the top bowler?', options: ['Bowler 1', 'Bowler 2', 'Bowler 3'] },
  { type: 'TOTAL_SIXES', category: 'FANCY', question: 'Total match sixes (Under/Over 14.5)', options: ['Under 14.5', 'Over 14.5'] },
  { type: 'TOTAL_FOURS', category: 'FANCY', question: 'Total match fours (Under/Over 28.5)', options: ['Under 28.5', 'Over 28.5'] },
  { type: 'POWERPLAY_SCORE', category: 'FANCY', question: '1st Innings Powerplay Runs (Under/Over 49.5)', options: ['Under 49.5', 'Over 49.5'] },
  { type: 'TOTAL_RUNS', category: 'FANCY', question: '1st Innings Total Runs (Under/Over 175.5)', options: ['Under 175.5', 'Over 175.5'] },
  { type: 'FIRST_WICKET', category: 'FANCY', question: 'First wicket fall over (Under/Over 3.5)', options: ['Under 3.5', 'Over 3.5'] },
];

export default function AdminPredictions() {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [matchPredictions, setMatchPredictions] = useState<any[]>([]);
  const [showAddTemplate, setShowAddTemplate] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.get('/admin/matches');
      setMatches(res.data);
    } catch (e) {
      toast.error('Failed to fetch matches');
    }
  };

  const handleSelectMatch = (match: any) => {
    setSelectedMatch(match);
    setMatchPredictions(match.predictions || []);
  };

  const handleAddPrediction = async (template: any) => {
    if (!selectedMatch) return;
    
    // Customize options for team-specific templates
    let finalOptions = template.options;
    if (template.type === 'MATCH_WINNER' || template.type === 'TOSS_WINNER') {
      finalOptions = [selectedMatch.team_a, selectedMatch.team_b];
    }

    try {
      const res = await api.post('/admin/prediction', {
        match_id: selectedMatch.id,
        type: template.type,
        category: template.category,
        question: template.question.replace('Team A', selectedMatch.team_a).replace('Team B', selectedMatch.team_b),
        options: finalOptions,
        lock_time: selectedMatch.start_time
      });
      
      setMatchPredictions([...matchPredictions, res.data]);
      toast.success('Prediction added successfully!');
      setShowAddTemplate(false);
    } catch (e) {
      toast.error('Failed to add prediction');
    }
  };

  const handleSettle = async () => {
    if (!selectedMatch) return;
    setLoading(true);
    try {
      // For now, this is a placeholder. You'd need to gather results for each prediction.
      // In a real app, you'd fetch the results from RapidAPI and auto-populate these.
      toast.success("Match settlement logic triggered!");
    } catch (e) {
      toast.error("Failed to settle match");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase">Prediction Center</h1>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Manage match markets and settlement</p>
            </div>
          </div>
          <button onClick={fetchMatches} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all">Refresh Matches</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Matches Column (4/12) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2 px-2 flex items-center gap-2 italic">
               <List className="w-3 h-3 text-primary" /> Active IPL Matches
            </h3>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {matches.map((match) => (
                <button 
                  key={match.id} 
                  onClick={() => handleSelectMatch(match)}
                  className={`card w-full p-5 border transition-all text-left group relative overflow-hidden ${selectedMatch?.id === match.id ? "bg-primary/10 border-primary" : "bg-[#0A0A0A] border-zinc-800 hover:border-zinc-700"}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">ID: #{match.api_match_id}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${match.status === 'LIVE' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-zinc-800 text-zinc-400'}`}>{match.status}</span>
                  </div>
                  <h4 className={`font-black uppercase tracking-widest text-sm group-hover:text-primary transition-colors ${selectedMatch?.id === match.id ? "text-primary" : "text-white"}`}>
                    {match.team_a} <span className="text-zinc-700 text-[10px] px-1 italic">vs</span> {match.team_b}
                  </h4>
                  <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-700 font-bold uppercase tracking-widest pt-4 border-t border-zinc-800/10">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(match.start_time).toLocaleDateString()}</span>
                    <span>{match.predictions?.length || 0} Markets</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Markets Management Column (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            {selectedMatch ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Selected Match Summary */}
                <div className="card bg-gradient-to-r from-[#111] to-black border-zinc-800 p-6 flex justify-between items-center">
                   <div>
                      <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-1">{selectedMatch.team_a} vs {selectedMatch.team_b}</h2>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{selectedMatch.venue || 'TBA'}</p>
                   </div>
                   <div className="flex gap-3">
                      <button 
                        onClick={() => setShowAddTemplate(!showAddTemplate)}
                        className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2"
                      >
                         <Plus size={14} /> Add Prediction
                      </button>
                   </div>
                </div>

                {/* Template List (Modal style or expanded) */}
                {showAddTemplate && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-top duration-300">
                    {PREDICTION_TEMPLATES.map((template, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleAddPrediction(template)}
                        className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-primary transition-all text-left"
                      >
                         <h5 className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">{template.type}</h5>
                         <p className="text-[11px] font-black text-white leading-tight mb-3 capitalize">{template.question.replace('Team A', '...').replace('Team B', '...')}</p>
                         <div className="flex flex-wrap gap-1">
                            {template.options.slice(0, 2).map((o, i) => (
                              <span key={i} className="px-2 py-0.5 bg-black rounded text-[8px] text-zinc-500 font-bold">{o}</span>
                            ))}
                            {template.options.length > 2 && <span className="text-[8px] text-zinc-700">+{template.options.length - 2} more</span>}
                         </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Markets List */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 px-2 flex items-center gap-2 italic">
                    <Trophy className="w-3 h-3" /> Active Markets ({matchPredictions.length})
                  </h3>
                  
                  {matchPredictions.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-950/30 rounded-3xl border border-dashed border-zinc-900">
                       <HelpCircle className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                       <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">No predictions configured for this match</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {matchPredictions.map((pred) => (
                        <div key={pred.id} className="card bg-[#0A0A0A] border-zinc-800 p-5 flex justify-between items-center group hover:border-zinc-700">
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${pred.is_settled ? 'bg-green-500' : 'bg-primary animate-pulse'}`} />
                                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-200">{pred.question}</h4>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                {pred.options.map((opt: string, i: number) => (
                                  <span key={i} className="text-[8px] font-bold text-zinc-600 uppercase bg-black px-2 py-0.5 rounded">{opt}</span>
                                ))}
                              </div>
                           </div>
                           <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-zinc-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Settlement Engine */}
                {matchPredictions.length > 0 && (
                   <div className="mt-8 p-8 card bg-primary/5 border-primary/20 border-dashed rounded-[2rem]">
                      <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 rounded-full bg-zinc-950 border border-primary/20 flex items-center justify-center mb-6">
                          <CheckCircle2 className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Match Settlement</h2>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest max-w-sm text-center">
                          Select the winning option for each market below to credit points.
                        </p>
                      </div>

                      <div className="space-y-4 max-w-2xl mx-auto mb-10">
                        {matchPredictions.filter(p => !p.is_settled).map((pred) => (
                          <div key={pred.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-black border border-zinc-800 rounded-2xl gap-4">
                            <span className="text-[10px] font-black uppercase text-zinc-400">{pred.question}</span>
                            <select 
                              id={`result-${pred.id}`}
                              className="bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-lg text-[10px] font-black uppercase outline-none focus:border-primary"
                            >
                              <option value="">Select Winner</option>
                              {pred.options.map((opt: string) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-center">
                        <button 
                          onClick={async () => {
                            setLoading(true);
                            const results: any = {};
                            matchPredictions.filter(p => !p.is_settled).forEach(p => {
                              const val = (document.getElementById(`result-${p.id}`) as HTMLSelectElement)?.value;
                              if (val) results[p.type] = val;
                            });

                            if (Object.keys(results).length === 0) {
                              toast.error("Please select results first");
                              setLoading(false);
                              return;
                            }

                            try {
                              await api.post(`/admin/settle/${selectedMatch.id}`, { results });
                              toast.success("Match settled successfully!");
                              fetchMatches();
                              setSelectedMatch(null);
                            } catch (e) {
                              toast.error("Settlement failed");
                            } finally {
                              setLoading(false);
                            }
                          }}
                          disabled={loading}
                          className="px-10 py-5 bg-primary text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/20"
                        >
                           {loading ? "Processing..." : <><Send size={18} /> Trigger Settlement Engine</>}
                        </button>
                      </div>
                   </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[500px] card border-dashed border-zinc-800 bg-zinc-950/10 text-center rounded-[3rem]">
                 <div className="p-8 bg-zinc-900/50 rounded-full mb-8 border border-zinc-800">
                   <Trophy className="w-16 h-16 text-zinc-800" />
                 </div>
                 <h2 className="text-zinc-500 font-black italic tracking-tighter uppercase text-3xl mb-3">Arena Waiting</h2>
                 <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.3em] max-w-xs mt-2 italic px-10">
                   Select a fixture from the roster to begin configuring market predictions or trigger settlement payouts.
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
