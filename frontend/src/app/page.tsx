import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-primary/20 before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-primary/10 after:via-primary/5 after:blur-2xl after:content-[''] before:lg:h-[360px] z-[-1]">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-primary drop-shadow-2xl animate-float">
            CRICBUZZ
          </h1>
        </div>
        
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-sans tracking-wide">
          India's Ultimate <span className="text-primary font-bold">IPL Virtual Prediction</span> Hub. 
          Unleash your cricket IQ, earn points & dominate the leaderboard!
        </p>

        <div className="flex gap-4 font-sans mt-4">
          <Link href="/auth/login" className="btn-primary flex items-center gap-2">
            Get Started
          </Link>
          <button className="px-6 py-2 rounded-lg border border-primary/20 hover:bg-white/5 transition-colors">
            Learn More
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl text-left font-sans">
          <div className="card">
            <h3 className="text-primary font-bold mb-2">Realtime Picks</h3>
            <p className="text-sm text-zinc-500">Predict every IPL match moment-to-moment with live updates.</p>
          </div>
          <div className="card">
            <h3 className="text-primary font-bold mb-2">Zero Risk</h3>
            <p className="text-sm text-zinc-500">Purely virtual points based. No real money, just pure sports thrill.</p>
          </div>
          <div className="card">
            <h3 className="text-primary font-bold mb-2">Global Ranks</h3>
            <p className="text-sm text-zinc-500">Climb the ladder and prove you're the true IPL maestro.</p>
          </div>
        </div>

        <footer className="mt-20 text-xs text-zinc-600 flex flex-col gap-2">
          <p>© 2026 Cricbuzz Virtual Prediction Platform. 18+ Only.</p>
          <div className="flex gap-4 justify-center">
            <span className="hover:text-primary cursor-pointer">Terms</span>
            <span className="hover:text-primary cursor-pointer">Privacy</span>
            <span className="hover:text-primary cursor-pointer">Responsible Gaming</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
