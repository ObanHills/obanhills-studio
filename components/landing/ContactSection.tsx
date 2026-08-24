"use client";
// components/landing/ContactSection.tsx
// High-conversion collaboration inquiry section with dark and light mode adaptation.

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, CheckCircle2, ArrowUpRight, Sparkles } from "lucide-react";
import { useStudioStore } from "@/lib/store";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const theme = useStudioStore((s) => s.theme);
  const isDark = theme === "dark";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project Inquiry from ${name} via ObanHills Studio`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:Obanhillsconnect@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
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
          {/* Left Info */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5a3]" />
                <span
                  className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                    isDark ? "text-[#00e5a3]" : "text-[#0d9488]"
                  }`}
                >
                  Start a Collaboration
                </span>
              </div>

              <h2
                className={`font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight ${
                  isDark ? "text-white" : "text-slate-950"
                }`}
              >
                Let’s create something unforgettable.
              </h2>

              <p
                className={`text-sm leading-relaxed ${
                  isDark ? "text-white/60" : "text-slate-600"
                }`}
              >
                Have a brand identity project, 3D experience, or creative tech idea in mind? Let’s connect and bring it to life.
              </p>
            </div>

            <div
              className={`flex flex-col gap-3 text-xs border-t pt-6 ${
                isDark ? "border-white/[0.08] text-white/50" : "border-slate-200 text-slate-600"
              }`}
            >
              <span
                className={`font-semibold uppercase tracking-wider text-[10px] ${
                  isDark ? "text-white/70" : "text-slate-900"
                }`}
              >
                Direct Contacts
              </span>
              <a
                href="mailto:Obanhillsconnect@gmail.com"
                className={`flex items-center gap-2 transition-colors ${
                  isDark ? "text-white hover:text-[#00e5a3]" : "text-slate-900 hover:text-[#0d9488]"
                }`}
              >
                <Mail size={14} className={isDark ? "text-[#00e5a3]" : "text-[#0d9488]"} />
                <span>Obanhillsconnect@gmail.com</span>
              </a>
              <a
                href="tel:+2347035721711"
                className={`flex items-center gap-2 transition-colors ${
                  isDark ? "text-white hover:text-[#00e5a3]" : "text-slate-900 hover:text-[#0d9488]"
                }`}
              >
                <MessageSquare size={14} className={isDark ? "text-[#00e5a3]" : "text-[#0d9488]"} />
                <span>+234 703 572 1711 (Phone | WhatsApp)</span>
              </a>
              <a
                href="tel:+2347035598886"
                className={`flex items-center gap-2 transition-colors ${
                  isDark ? "text-white hover:text-[#00e5a3]" : "text-slate-900 hover:text-[#0d9488]"
                }`}
              >
                <MessageSquare size={14} className={isDark ? "text-[#00e5a3]" : "text-[#0d9488]"} />
                <span>+234 703 559 8886 (Phone | WhatsApp)</span>
              </a>
              <div className="flex items-center gap-4 pt-2">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 transition-colors ${
                    isDark ? "text-white/50 hover:text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight size={11} />
                </a>
                <a
                  href="https://behance.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 transition-colors ${
                    isDark ? "text-white/50 hover:text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <span>Behance</span>
                  <ArrowUpRight size={11} />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 transition-colors ${
                    isDark ? "text-white/50 hover:text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <span>GitHub</span>
                  <ArrowUpRight size={11} />
                </a>
              </div>
            </div>
          </div>


          {/* Right Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#00e5a3]/30 bg-[#00e5a3]/10 p-12 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00e5a3] text-black">
                  <CheckCircle2 size={24} />
                </div>
                <h3
                  className={`font-display text-xl font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Message Prepared!
                </h3>
                <p className="text-xs text-white/60 max-w-sm">
                  Your email client has been opened with your inquiry. I’ll respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-[#00e5a3] hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-white/50" : "text-slate-600"
                      }`}
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="admin-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-white/50" : "text-slate-600"
                      }`}
                    >
                      Your Email *
                    </label>
                    <input
                      type="email"
                      placeholder="jane@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      isDark ? "text-white/50" : "text-slate-600"
                    }`}
                  >
                    Project Details & Scope *
                  </label>
                  <textarea
                    placeholder="Tell me about your brand, timeframe, visual or 3D requirements…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                    className="admin-input resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-[#00e5a3] bg-[#00e5a3] py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(0,229,163,0.3)] transition-all hover:bg-[#00ffd5] hover:shadow-[0_0_30px_rgba(0,229,163,0.45)]"
                >
                  <Send size={14} />
                  <span>Send Project Inquiry</span>
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
