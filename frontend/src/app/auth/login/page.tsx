"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token, user } = response.data;
      
      localStorage.setItem("token", access_token);
      localStorage.setItem("user_role", user.role);
      toast.success(user.role === 'ADMIN' ? "Admin Login Detected" : "Login successful!");
      router.push(user.role === 'ADMIN' ? "/admin" : "/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black items-center justify-center p-6">
      <div className="card w-full max-w-md p-8 bg-zinc-900 border-primary/20">
        <h2 className="text-3xl font-black text-primary mb-2 italic tracking-tigh">LOGIN</h2>
        <p className="text-zinc-500 mb-8 uppercase text-[10px] font-bold tracking-widest">Virtual Cricket Hub</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors text-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="btn-primary w-full py-4 mt-6 flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs"
          >
            {loading ? <span className="animate-spin text-xl">◌</span> : "SIGN IN"}
          </button>
        </form>

        <p className="mt-8 text-[10px] text-center text-zinc-500 uppercase font-bold tracking-widest">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            SIGN UP NOW
          </Link>
        </p>

        <p className="mt-6 text-[8px] text-center text-zinc-700 uppercase font-black">
          By continuing, you agree to our Terms and confirm you are 18+.
        </p>
      </div>
    </div>
  );
}
