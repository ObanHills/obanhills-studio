"use client";
// components/admin/AdminLogin.tsx
// Sleek, luxury authentication gate with glassmorphic vault styling.

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Invalid access key. Please verify and try again.");
        return;
      }
      sessionStorage.setItem("admin_pw", password);
      onSuccess();
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#07090e] p-6 overflow-hidden">
      {/* Subtle background ambient radial glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#00e5a3]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-[#00d2ff]/10 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0d1219]/80 p-8 md:p-10 shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_24px_rgba(0,229,163,0.05)] backdrop-blur-2xl"
      >
        {/* Brand Crest */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00e5a3]/30 bg-[#00e5a3]/10 shadow-[0_0_20px_rgba(0,229,163,0.2)]">
            <ShieldCheck size={26} className="text-[#00e5a3]" />
          </div>
          <Image
            src="/logo.png"
            alt="ObanHills Studio"
            width={160}
            height={56}
            className="h-12 w-auto object-contain"
            priority
          />
          <p className="mt-2 text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
            Studio CMS Executive
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
              Admin Access Key
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 pl-11 text-sm text-white placeholder-white/20 outline-none transition-all duration-200 focus:border-[#00e5a3]/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#00e5a3]/20"
              />
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs text-red-400 font-medium"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading || !password}
            whileTap={{ scale: 0.98 }}
            className="mt-1 flex items-center justify-center gap-2 rounded-xl border border-[#00e5a3]/40 bg-[#00e5a3]/20 py-3.5 text-sm font-semibold text-[#00e5a3] shadow-[0_0_20px_rgba(0,229,163,0.15)] transition-all duration-200 hover:bg-[#00e5a3]/30 hover:shadow-[0_0_28px_rgba(0,229,163,0.25)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>Authenticate</span>
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </form>

        {/* Back to 3D Scene */}
        <div className="mt-8 border-t border-white/[0.06] pt-6 text-center">
          <Link
            href="/"
            className="text-xs text-white/40 transition-colors hover:text-white hover:underline"
          >
            ← Return to 3D Digital Terrain
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
