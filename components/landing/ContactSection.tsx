"use client";
// components/landing/ContactSection.tsx
// High-conversion collaboration inquiry section.
// Submits to POST /api/contact (Resend) instead of opening mailto:.
// Falls back to a helpful message if the email service is unavailable.

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, Loader2, ArrowUpRight } from "lucide-react";
import { useStudioStore } from "@/lib/store";

type FormState = "idle" | "sending" | "success" | "error";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const theme = useStudioStore((s) => s.theme);
  const isDark = theme === "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setFormState("success");
    } catch (err) {
      setFormState("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const reset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setFormState("idle");
    setErrorMessage("");
  };

  return (
    <section id="contact" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div
        className={`rounded-3xl border p-8 sm:p-12 lg:p-16 backdrop-blur-2xl ${
          isDark
            ? "border-white/[0.1] bg-[#0c1017]/90 shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
            : "border-slate-200 bg-white/95 shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ── Left Info ──────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5a3]" />
                <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? "text-[#00e5a3]" : "text-[#0d9488]"}`}>
                  Start a Collaboration
                </span>
              </div>
              <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight ${isDark ? "text-white" : "text-slate-950"}`}>
                Let's create something unforgettable.
              </h2>
              <p className={`text-sm leading-relaxed ${isDark ? "text-white/60" : "text-slate-600"}`}>
                Have a brand identity project, 3D experience, or creative tech idea in mind? Drop me a message — I respond within 24 hours.
              </p>
            </div>

            <div className={`flex flex-col gap-3 text-xs border-t pt-6 ${isDark ? "border-white/[0.08] text-white/50" : "border-slate-200 text-slate-600"}`}>
              <span className={`font-semibold uppercase tracking-wider text-[10px] ${isDark ? "text-white/70" : "text-slate-900"}`}>
                Direct Contacts
              </span>
              <a href="mailto:Obanhillsconnect@gmail.com" className={`flex items-center gap-2 transition-colors ${isDark ? "text-white hover:text-[#00e5a3]" : "text-slate-900 hover:text-[#0d9488]"}`}>
                <Mail size={14} className={isDark ? "text-[#00e5a3]" : "text-[#0d9488]"} />
                <span>Obanhillsconnect@gmail.com</span>
              </a>
              <a href="tel:+2347035721711" className={`flex items-center gap-2 transition-colors ${isDark ? "text-white hover:text-[#00e5a3]" : "text-slate-900 hover:text-[#0d9488]"}`}>
                <MessageSquare size={14} className={isDark ? "text-[#00e5a3]" : "text-[#0d9488]"} />
                <span>+234 703 572 1711 (Phone · WhatsApp)</span>
              </a>
              <a href="tel:+2347035598886" className={`flex items-center gap-2 transition-colors ${isDark ? "text-white hover:text-[#00e5a3]" : "text-slate-900 hover:text-[#0d9488]"}`}>
                <MessageSquare size={14} className={isDark ? "text-[#00e5a3]" : "text-[#0d9488]"} />
                <span>+234 703 559 8886 (Phone · WhatsApp)</span>
              </a>
              <div className="flex items-center gap-4 pt-2">
                {[
                  { label: "LinkedIn", href: "https://www.linkedin.com/in/sunday-itodo-obande-b2067b410/" },
                  { label: "Behance", href: "https://www.behance.net/ObanHills" },
                  { label: "Facebook", href: "https://web.facebook.com/profile.php?id=61550923636252" },
                ].map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-1 transition-colors ${isDark ? "text-white/50 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}>
                    <span>{label}</span>
                    <ArrowUpRight size={11} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Form ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-7">

            {/* Success state */}
            {formState === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#00e5a3]/30 bg-[#00e5a3]/10 p-12 text-center h-full min-h-[300px]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#00e5a3] text-black shadow-[0_0_24px_rgba(0,229,163,0.4)]">
                  <CheckCircle2 size={26} />
                </div>
                <h3 className={`font-display text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Message sent!
                </h3>
                <p className={`text-sm max-w-xs leading-relaxed ${isDark ? "text-white/60" : "text-slate-600"}`}>
                  Your inquiry is in my inbox. I'll get back to you within 24 hours.
                </p>
                <button onClick={reset} className="mt-2 text-xs font-semibold text-[#00e5a3] hover:underline">
                  Send another message
                </button>
              </motion.div>
            )}

            {/* Form */}
            {formState !== "success" && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-white/50" : "text-slate-600"}`}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      minLength={2}
                      maxLength={120}
                      disabled={formState === "sending"}
                      className="admin-input disabled:opacity-50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-white/50" : "text-slate-600"}`}>
                      Your Email *
                    </label>
                    <input
                      type="email"
                      placeholder="jane@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      maxLength={200}
                      disabled={formState === "sending"}
                      className="admin-input disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-white/50" : "text-slate-600"}`}>
                    Project Details & Scope *
                  </label>
                  <textarea
                    placeholder="Tell me about your brand, timeline, and what you want to build…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    required
                    minLength={10}
                    maxLength={4000}
                    disabled={formState === "sending"}
                    className="admin-input resize-none disabled:opacity-50"
                  />
                  <span className={`text-right text-[10px] tabular-nums ${isDark ? "text-white/25" : "text-slate-400"}`}>
                    {message.length} / 4000
                  </span>
                </div>

                {/* Error banner */}
                {formState === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400"
                  >
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={formState === "sending"}
                  whileTap={formState !== "sending" ? { scale: 0.98 } : {}}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-[#00e5a3] bg-[#00e5a3] py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(0,229,163,0.3)] transition-all hover:bg-[#00ffd5] hover:shadow-[0_0_30px_rgba(0,229,163,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formState === "sending" ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Send Project Inquiry</span>
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
