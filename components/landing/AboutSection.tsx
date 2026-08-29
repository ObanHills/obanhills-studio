"use client";
// components/landing/AboutSection.tsx
// Redesigned: editorial magazine layout — full-bleed portrait on the right,
// clean narrative on the left. Less widget, more presence.

import { motion } from "framer-motion";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useStudioStore } from "@/lib/store";

const STACK = [
  "Adobe Photoshop",
  "Next.js & React",
  "Three.js / WebGL",
  "Generative AI & ML",
  "Tailwind CSS",
  "Supabase",
  "Framer Motion",
  "Event Identity",
];

const STATS = [
  { value: "2024", label: "Founded" },
  { value: "10+", label: "Projects" },
  { value: "3", label: "Disciplines" },
];

export function AboutSection() {
  const theme = useStudioStore((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <section id="about" className="relative py-16 px-6 md:px-12 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

        {/* ── Left: Narrative ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 flex flex-col gap-7 lg:pt-2"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00e5a3]" />
            <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? "text-[#00e5a3]" : "text-[#0d9488]"}`}>
              The Vision & Founder
            </span>
          </div>

          {/* Headline */}
          <h2 className={`font-display text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1] ${isDark ? "text-white" : "text-slate-950"}`}>
            Hi, I&apos;m{" "}
            <span className={isDark ? "text-[#00e5a3]" : "text-[#0d9488]"}>
              Obande
            </span>
            <br />Sunday Itodo.
          </h2>

          {/* Role line */}
          <p className={`text-sm font-semibold uppercase tracking-[0.15em] -mt-4 ${isDark ? "text-white/40" : "text-slate-500"}`}>
            CEO & Lead Creative · ObanHills Studio
          </p>

          {/* Body copy */}
          <div className={`flex flex-col gap-4 text-sm leading-[1.8] ${isDark ? "text-white/65" : "text-slate-600"}`}>
            <p>
              I bridge{" "}
              <strong className={isDark ? "text-white/90" : "text-slate-900"}>classic visual craft</strong>{" "}
              with{" "}
              <strong className={isDark ? "text-white/90" : "text-slate-900"}>futuristic interactive technology</strong>.
              From brand identities for major tech events to living 3D digital worlds — every project is built on one belief:
            </p>

            {/* Pull quote */}
            <div className={`relative pl-5 py-1 border-l-2 border-[#00e5a3]`}>
              <p className={`font-display text-base font-semibold italic leading-relaxed ${isDark ? "text-white/90" : "text-slate-800"}`}>
                &ldquo;Building The Digital Peak — visual experiences that feel timeless yet undeniably ahead.&rdquo;
              </p>
            </div>

            <p>
              Every commission — brand suite, spatial web app, or AI-driven campaign — is delivered with
              the same meticulous precision, whether for a startup or a summit.
            </p>
          </div>

          {/* Stats strip */}
          <div className={`flex items-center gap-8 pt-2 border-t ${isDark ? "border-white/[0.07]" : "border-slate-200"}`}>
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <span className={`font-display text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {s.value}
                </span>
                <span className={`text-[10px] uppercase tracking-[0.15em] font-semibold ${isDark ? "text-white/35" : "text-slate-500"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Stack pills */}
          <div className="flex flex-col gap-3">
            <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${isDark ? "text-white/30" : "text-slate-400"}`}>
              Core Stack
            </span>
            <div className="flex flex-wrap gap-2">
              {STACK.map((item) => (
                <span
                  key={item}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium ${
                    isDark
                      ? "border-white/[0.07] bg-white/[0.03] text-white/60"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  <CheckCircle2 size={11} className={isDark ? "text-[#00e5a3]" : "text-[#0d9488]"} />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4 pt-2">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-[#00e5a3] bg-[#00e5a3] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(0,229,163,0.25)] transition-all hover:bg-[#00ffd5] hover:shadow-[0_0_32px_rgba(0,229,163,0.4)]"
            >
              Let&apos;s Build Together
              <ArrowUpRight size={13} />
            </a>
            <a
              href="mailto:Obanhillsconnect@gmail.com"
              className={`text-xs font-semibold underline underline-offset-4 transition-colors ${isDark ? "text-white/40 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
            >
              Obanhillsconnect@gmail.com
            </a>
          </div>
        </motion.div>

        {/* ── Right: Editorial portrait ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lg:col-span-5 relative"
        >
          {/* Outer glow */}
          <div
            className="pointer-events-none absolute -inset-4 rounded-[2rem] blur-3xl opacity-30"
            style={{ background: "radial-gradient(ellipse at 60% 40%, #00e5a320, transparent 70%)" }}
          />

          <div className={`relative overflow-hidden rounded-3xl ${isDark ? "bg-[#0a0f16]" : "bg-slate-100"}`}
            style={{ aspectRatio: "3/4", maxHeight: "560px" }}
          >
            {/* Photo — full bleed, face centred */}
            <Image
              src="/obande.jpg"
              alt="Obande Sunday Itodo"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 480px"
              priority
            />

            {/* Bottom gradient scrim for the info bar */}
            <div
              className="absolute inset-x-0 bottom-0 h-2/5"
              style={{
                background: isDark
                  ? "linear-gradient(to top, rgba(7,9,14,0.97) 0%, rgba(7,9,14,0.7) 50%, transparent 100%)"
                  : "linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.55) 50%, transparent 100%)",
              }}
            />

            {/* Accent top-right corner glow */}
            <div
              className="pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full blur-3xl opacity-25"
              style={{ background: "#00e5a3" }}
            />

            {/* Info bar — sits over the gradient */}
            <div className="absolute inset-x-0 bottom-0 p-7 flex flex-col gap-4">
              {/* Name block */}
              <div>
                <h3 className="font-display text-2xl font-bold text-white leading-tight">
                  Obande Sunday Itodo
                </h3>
                <p className="text-sm font-semibold text-[#00e5a3] mt-0.5">
                  CEO | Lead Creative
                </p>
                <p className="text-[11px] text-white/40 mt-0.5 tracking-wide">
                  ObanHills Studio · Est. 2024 · Nigeria & Global
                </p>
              </div>

              {/* Status + availability */}
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-xs text-white/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00e5a3] animate-pulse shadow-[0_0_6px_#00e5a3]" />
                  Available for commissions
                </span>

                {/* Specialization tag */}
                <span className="rounded-full border border-[#00e5a3]/30 bg-[#00e5a3]/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#00e5a3] backdrop-blur-md">
                  Brand · 3D · AI
                </span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
