"use client";
// components/landing/AboutSection.tsx
// About the Founder & Lead: Obande Sunday Itodo and the Uniquely Classic philosophy.

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useStudioStore } from "@/lib/store";

export function AboutSection() {
  const theme = useStudioStore((s) => s.theme);
  const isDark = theme === "dark";

  const stack = [
    "Adobe Photoshop",
    "Next.js & React",
    "Three.js / WebGL",
    "Generative AI & ML",
    "Tailwind CSS",
    "Supabase & PostgreSQL",
    "Framer Motion",
    "Graphic & Event Identity",
  ];

  return (
    <section id="about" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Left Narrative */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00e5a3]" />
            <span
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                isDark ? "text-[#00e5a3]" : "text-[#0d9488]"
              }`}
            >
              The Vision & Founder
            </span>
          </div>

          <h2
            className={`font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight ${
              isDark ? "text-white" : "text-slate-950"
            }`}
          >
            Hi, I&apos;m{" "}
            <span className={isDark ? "text-[#00e5a3]" : "text-[#0d9488]"}>
              Obande Sunday Itodo
            </span>{" "}
            — Lead Creative at ObanHills.
          </h2>

          <div
            className={`flex flex-col gap-4 text-sm sm:text-base leading-relaxed ${
              isDark ? "text-white/70" : "text-slate-700"
            }`}
          >
            <p>
              I bridge the gap between{" "}
              <strong className={isDark ? "text-white" : "text-slate-900"}>
                classic visual aesthetics
              </strong>{" "}
              and{" "}
              <strong className={isDark ? "text-white" : "text-slate-900"}>
                futuristic interactive technology
              </strong>
              . From designing prominent visual identities for major tech summits like the{" "}
              <em>Jos TechFest AI Summit 2025</em> to engineering living 3D digital worlds, my work
              is driven by one core philosophy:
            </p>
            <blockquote
              className={`my-2 border-l-2 border-[#00e5a3] pl-4 py-1 font-display text-lg font-medium italic ${
                isDark ? "text-white/90" : "text-slate-800"
              }`}
            >
              &ldquo;Uniquely Classic — creating visual experiences that feel timelessly structured
              yet undeniably ahead of their time.&rdquo;
            </blockquote>
            <p>
              Whether partnering with brands for full-scale visual suites, directing high-impact
              creative campaigns, or crafting interactive spatial web applications, every project is
              delivered with meticulous precision.
            </p>
          </div>

          {/* Toolkit Pills */}
          <div className="pt-4">
            <span
              className={`text-xs font-semibold uppercase tracking-wider mb-3 block ${
                isDark ? "text-white/40" : "text-slate-500"
              }`}
            >
              Core Toolkit &amp; Creative Stack
            </span>
            <div className="flex flex-wrap gap-2.5">
              {stack.map((item) => (
                <span
                  key={item}
                  className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-medium ${
                    isDark
                      ? "border-white/[0.08] bg-[#0c1017] text-white/80"
                      : "border-slate-200 bg-white text-slate-700 shadow-xs"
                  }`}
                >
                  <CheckCircle2 size={13} className={isDark ? "text-[#00e5a3]" : "text-[#0d9488]"} />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Feature Card */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`relative rounded-3xl border overflow-hidden backdrop-blur-2xl ${
              isDark
                ? "border-white/[0.1] bg-gradient-to-b from-[#0e141d] to-[#070a0f] shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
                : "border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
            }`}
          >
            {/* Glowing Accent */}
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#00e5a3]/10 blur-3xl pointer-events-none z-0" />

            {/* Large Portrait — full width, head fully visible */}
            <div className="relative w-full h-80 sm:h-96 overflow-hidden">
              <Image
                src="/obande.jpg"
                alt="Obande Sunday Itodo"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 480px"
                priority
              />
              {/* Gradient fade into card body */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t ${
                  isDark ? "from-[#0e141d]" : "from-white"
                } to-transparent`}
              />
            </div>

            {/* Card Body */}
            <div className="relative z-10 flex flex-col gap-5 px-7 pb-7 -mt-6">
              {/* Name & Title */}
              <div>
                <h3
                  className={`font-display text-2xl font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Obande Sunday Itodo
                </h3>
                <span
                  className={`text-sm font-semibold tracking-wide ${
                    isDark ? "text-[#00e5a3]" : "text-[#0d9488]"
                  }`}
                >
                  CEO | Lead Creative
                </span>
                <p
                  className={`text-xs mt-0.5 ${
                    isDark ? "text-white/40" : "text-slate-500"
                  }`}
                >
                  ObanHills Studio · Est. 2024 · Nigeria &amp; Global
                </p>
              </div>

              {/* Info Rows */}
              <div
                className={`space-y-3 text-xs leading-relaxed border-t pt-5 ${
                  isDark ? "border-white/[0.08] text-white/60" : "border-slate-200 text-slate-600"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`font-semibold min-w-[90px] ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Specialization:
                  </span>
                  <span>Brand Identity, AI Creative Systems &amp; 3D Web</span>
                </div>
                <div className="flex items-start gap-3">
                  <span
                    className={`font-semibold min-w-[90px] ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Status:
                  </span>
                  <span
                    className={`font-semibold flex items-center gap-1.5 ${
                      isDark ? "text-[#00e5a3]" : "text-[#0d9488]"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00e5a3] animate-pulse" />
                    Available for commissions &amp; collaborations
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span
                    className={`font-semibold min-w-[90px] ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Direct Inquiry:
                  </span>
                  <span
                    className={`font-mono ${
                      isDark ? "text-white/80" : "text-slate-800 font-semibold"
                    }`}
                  >
                    talk2obandesunday@gmail.com
                  </span>
                </div>
              </div>

              <a
                href="#contact"
                className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-[#00e5a3]/40 bg-[#00e5a3]/20 py-3 text-xs font-bold uppercase tracking-wider text-[#008f66] dark:text-[#00e5a3] transition-all hover:bg-[#00e5a3]/30 hover:shadow-[0_0_24px_rgba(0,229,163,0.2)]"
              >
                Let&apos;s Build Together →
              </a>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
