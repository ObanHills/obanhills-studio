"use client";
// components/landing/HeroSection.tsx
// Balanced, high-end Hero section with centered composition, soft backdrop isolation,
// and WCAG AAA contrast in both Dark and Light modes.

import { motion } from "framer-motion";
import { Box, ArrowDown, Sparkles, Layers, ShieldCheck, Heart } from "lucide-react";
import { useStudioStore } from "@/lib/store";
import type { Project } from "@/types";

interface HeroSectionProps {
  projects: Project[];
  onExplore3D: () => void;
}

export function HeroSection({ projects, onExplore3D }: HeroSectionProps) {
  const totalLikes = projects.reduce((acc, p) => acc + (p.likes_count || 0), 0);
  const theme = useStudioStore((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <section className="relative z-[10] min-h-[90vh] flex flex-col items-center justify-center pt-28 pb-20 px-6 md:px-12 max-w-5xl mx-auto text-center">
      {/* Soft Radial Ambient Isolation Mask behind hero text */}
      <div
        className={`pointer-events-none absolute inset-0 -z-10 rounded-3xl blur-3xl opacity-80 transition-opacity ${
          isDark
            ? "bg-radial from-[#07090e]/95 via-[#07090e]/60 to-transparent"
            : "bg-radial from-white/95 via-white/70 to-transparent"
        }`}
      />

      <div className="relative z-10 flex flex-col items-center gap-7 max-w-3xl">
        {/* Creative Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 backdrop-blur-md shadow-xs ${
            isDark
              ? "border-[#00e5a3]/30 bg-[#00e5a3]/10 text-[#00e5a3]"
              : "border-teal-600/30 bg-teal-50 text-teal-800"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-[#00e5a3] shadow-[0_0_8px_#00e5a3]" />
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Visual Identity · 3D Experiences · Creative Direction
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight ${
            isDark ? "text-white" : "text-slate-950"
          }`}
        >
          Architecting{" "}
          <span
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] via-[#f2d98a] to-[#c9a84c]"
          >
            Building The Digital Peak
          </span>{" "}
          Visual Realities.
        </motion.h1>

        {/* Subheading — one sharp sentence, not a service menu */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-base sm:text-lg leading-relaxed max-w-xl font-normal ${
            isDark ? "text-white/75" : "text-slate-700"
          }`}
        >
          I build brands that hold — and digital experiences people don't forget.
          {" "}
          <strong
            className={`font-semibold ${
              isDark ? "text-white/90" : "text-slate-900"
            }`}
          >
            Obande Sunday Itodo
          </strong>
          , Creative Director & Spatial Web Engineer.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          {/* Launch 3D World */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onExplore3D}
            className="flex items-center gap-2.5 rounded-xl border border-[#00e5a3] bg-[#00e5a3] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_24px_rgba(0,229,163,0.3)] transition-all hover:bg-[#00ffd5] hover:shadow-[0_0_36px_rgba(0,229,163,0.45)]"
          >
            <Box size={16} />
            <span>Enter 3D Digital Terrain</span>
          </motion.button>

          {/* View Works Anchor */}
          <a
            href="#works"
            className={`flex items-center gap-2 rounded-xl border px-6 py-3.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all ${
              isDark
                ? "border-white/[0.12] bg-white/[0.04] text-white hover:border-white/30 hover:bg-white/[0.08]"
                : "border-slate-300 bg-white/90 text-slate-800 hover:border-slate-400 hover:bg-white shadow-sm"
            }`}
          >
            <span>Explore Works</span>
            <ArrowDown size={14} className={isDark ? "text-[#00e5a3]" : "text-teal-700"} />
          </a>
        </motion.div>

        {/* Balanced Live Metrics Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={`grid grid-cols-3 gap-8 pt-8 mt-2 border-t w-full max-w-md ${
            isDark ? "border-white/[0.1]" : "border-slate-200/90"
          }`}
        >
          <div className="flex flex-col items-center">
            <span
              className={`font-display text-2xl font-bold ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              {projects.length}
            </span>
            <span
              className={`text-[11px] uppercase tracking-wider font-semibold ${
                isDark ? "text-white/45" : "text-slate-500"
              }`}
            >
              Featured Nodes
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span
              className={`font-display text-2xl font-bold ${
                isDark ? "text-[#00e5a3]" : "text-teal-700"
              }`}
            >
              {totalLikes}
            </span>
            <span
              className={`text-[11px] uppercase tracking-wider font-semibold ${
                isDark ? "text-white/45" : "text-slate-500"
              }`}
            >
              Live Likes
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span
              className={`font-display text-2xl font-bold ${
                isDark ? "text-cyan-400" : "text-cyan-700"
              }`}
            >
              100%
            </span>
            <span
              className={`text-[11px] uppercase tracking-wider font-semibold ${
                isDark ? "text-white/45" : "text-slate-500"
              }`}
            >
              Custom Craft
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
