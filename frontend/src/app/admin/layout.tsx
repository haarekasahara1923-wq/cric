"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Activity } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("user_role");

    if (!token || role !== "ADMIN") {
      router.replace("/auth/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
           <p className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Universal Admin Topbar */}
      <div className="bg-zinc-950 border-b border-zinc-900 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
               <ShieldCheck className="text-primary w-5 h-5" />
            </div>
            <div>
               <h2 className="text-sm font-black italic tracking-tighter uppercase text-white">Admin Terminal</h2>
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                 System Online
               </p>
            </div>
         </div>
         <button onClick={() => router.push('/dashboard')} className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-black uppercase hover:bg-zinc-800 hover:text-white transition-all text-zinc-400">Exit Admin</button>
      </div>

      <div className="pt-6">
        {children}
      </div>
    </div>
  );
}
