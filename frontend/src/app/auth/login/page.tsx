"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/otp/send", { email });
      setStep(2);
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/otp/verify", { email, otp });
      const { access_token } = response.data;
      
      // Store token
      localStorage.setItem("token", access_token);
      
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black items-center justify-center p-6">
      <div className="card w-full max-w-md p-8 bg-zinc-900 border-primary/20">
        <h2 className="text-3xl font-black text-primary mb-2">Welcome Back</h2>
        <p className="text-zinc-500 mb-8">Login to your virtual cricket hub</p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
              <input
                type="email"
                required
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? <span className="animate-spin text-xl">◌</span> : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Enter 6-digit OTP sent to {email}
              </label>
              <input
                type="text"
                required
                maxLength={6}
                className="w-full tracking-[1em] text-center font-bold bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? <span className="animate-spin text-xl">◌</span> : "Verify & Login"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-zinc-500 text-sm hover:text-primary transition-colors mt-2"
            >
              Edit Email
            </button>
          </form>
        )}

        <p className="mt-8 text-xs text-center text-zinc-600">
          By continuing, you agree to our Terms of Service and confirm you are 18+.
        </p>
      </div>
    </div>
  );
}
