"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      const { access_token } = response.data;
      localStorage.setItem("token", access_token);
      
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black items-center justify-center p-6">
      <div className="card w-full max-w-md p-8 bg-zinc-900 border-primary/20">
        <h2 className="text-3xl font-black text-primary mb-2 italic tracking-tigh">JOIN NOW</h2>
        <p className="text-zinc-500 mb-8 uppercase text-[10px] font-bold tracking-widest">Create Your Virtual Account</p>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Full Name</label>
            <input
              type="text"
              required
              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors text-sm"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors text-sm"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors text-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Confirm</label>
              <input
                type="password"
                required
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors text-sm"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="btn-primary w-full py-4 mt-6 flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs"
          >
            {loading ? <span className="animate-spin text-xl">◌</span> : "CREATE ACCOUNT"}
          </button>
        </form>

        <p className="mt-8 text-[10px] text-center text-zinc-500 uppercase font-bold tracking-widest">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            LOGIN HERE
          </Link>
        </p>
      </div>
    </div>
  );
}
