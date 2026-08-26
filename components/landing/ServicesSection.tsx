"use client";
// components/landing/ServicesSection.tsx
// Portrait minimal service cards — tall, narrow, clean.
// Four cards in a horizontal row on desktop, 2-col on tablet, 1-col on mobile.

import { motion } from "framer-motion";
import { Palette, Box, Cpu, Layout } from "lucide-react";
import { useStudioStore } from "@/lib/store";

const SERVICES = [
  {
    icon: Palette,
    number: "01",
    title: "Brand Identity & Visual Suites",
    description:
      "Full-spectrum visual systems, event branding kits, promotional posters, flyers, and digital brand assets built to establish a dominant, memorable presence.",
    tags: ["Visual Identity", "Event Branding", "Typography"],
    accent: "#00e5a3",
  },
  {
    icon: Box,
    number: "02",
    title: "Interactive 3D & Spatial Web",
    description:
      "Immersive 3D environments, procedural digital terrains, interactive node architectures, and WebGL experiences built on React Three Fiber.",
    tags: ["Three.js", "WebGL", "Next.js"],
    accent: "#38bdf8",
  },
  {
    icon: Cpu,
    number: "03",
    title: "AI Workflows & Generative Media",
    description:
      "State-of-the-art AI models for typeface design, generative graphics, procedural asset pipelines, and automated creative production.",
    tags: ["Generative Visuals", "AI Systems", "Creative Tech"],
    accent: "#a78bfa",
  },
  {
    icon: Layout,
    number: "04",
    title: "UI/UX & Digital Product Design",
    description:
      "High-conversion interfaces and design systems engineered with micro-interactions, responsive physics, and glassmorphic precision.",
    tags: ["Figma", "Framer Motion", "Design Systems"],
    accent: "#f59e0b",
  },
];

export function ServicesSection() {
  const theme = useStudioStore((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <section id="services" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00e5a3]" />
            <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? "text-[#00e5a3]" : "text-[#0d9488]"}`}>
              Capabilities
            </span>
          </div>
          <h2 className={`font-display text-3xl md:text-5xl font-bold tracking-tight max-w-xl ${isDark ? "text-white" : "text-slate-950"}`}>
            What I bring to every project.
          </h2>
        </div>
        <p className={`max-w-xs text-sm leading-relaxed ${isDark ? "text-white/50" : "text-slate-500"}`}>
          Four disciplines. One cohesive vision. Every engagement is handled end-to-end.
        </p>
      </div>

      {/* Portrait Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SERVICES.map((service, idx) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={`group relative flex flex-col justify-between rounded-2xl border overflow-hidden transition-all duration-300 ${
                isDark
                  ? "border-white/[0.07] bg-[#0c1017]/80 hover:border-white/[0.15]"
                  : "border-slate-200/80 bg-white/95 hover:border-slate-300 shadow-[0_2px_16px_rgba(0,0,0,0.05)]"
              }`}
              style={{ minHeight: "380px" }}
            >
              {/* Accent top strip */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${service.accent}, transparent)`,
                  opacity: 0.7,
                }}
              />

              {/* Subtle glow */}
              <div
                className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `${service.accent}18` }}
              />

              <div className="flex flex-col gap-5 p-7">
                {/* Number */}
                <span
                  className="font-display text-[11px] font-bold tracking-[0.25em] opacity-30"
                  style={{ color: service.accent }}
                >
                  {service.number}
                </span>

                {/* Icon */}
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110"
                  style={{
                    borderColor: `${service.accent}33`,
                    background: `${service.accent}12`,
                    color: service.accent,
                    boxShadow: `0 0 14px ${service.accent}18`,
                  }}
                >
                  <Icon size={20} />
                </div>

                {/* Title */}
                <h3 className={`font-display text-lg font-bold leading-snug ${isDark ? "text-white" : "text-slate-900"}`}>
                  {service.title}
                </h3>

                {/* Description */}
                <p className={`text-xs leading-relaxed ${isDark ? "text-white/50" : "text-slate-500"}`}>
                  {service.description}
                </p>
              </div>

              {/* Tags — pinned to bottom */}
              <div className={`flex flex-wrap gap-1.5 px-7 pb-7 mt-auto border-t pt-5 ${isDark ? "border-white/[0.05]" : "border-slate-100"}`}>
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-md px-2.5 py-1 text-[10px] font-medium border ${
                      isDark
                        ? "border-white/[0.06] bg-white/[0.02] text-white/40"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
