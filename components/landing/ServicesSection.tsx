"use client";
// components/landing/ServicesSection.tsx
// Core studio capabilities and creative disciplines with dark/light mode adaptation.

import { motion } from "framer-motion";
import { Palette, Box, Cpu, Compass, Layout, Sparkles } from "lucide-react";
import { useStudioStore } from "@/lib/store";

const SERVICES = [
  {
    icon: Palette,
    title: "Brand Identity & Visual Suites",
    description:
      "Full-spectrum visual systems, event branding kits, promotional posters, flyers, custom typography, and digital brand assets built to establish a dominant, memorable presence.",
    tags: ["Visual Identity", "Event Branding", "Photoshop", "Typography"],
  },
  {
    icon: Box,
    title: "Interactive 3D & Spatial Web",
    description:
      "Immersive 3D environments, procedural digital terrains, interactive node architectures, and WebGL experiences built on React Three Fiber and Three.js.",
    tags: ["Three.js", "React Three Fiber", "WebGL", "Next.js"],
  },
  {
    icon: Cpu,
    title: "AI Workflows & Generative Media",
    description:
      "Leveraging state-of-the-art artificial intelligence models for typeface design, generative graphics, procedural asset pipelines, and automated creative production.",
    tags: ["Machine Learning", "Generative Visuals", "Creative Tech", "AI Systems"],
  },
  {
    icon: Layout,
    title: "UI/UX & Digital Product Design",
    description:
      "Futuristic, high-conversion interfaces and design systems engineered with micro-interactions, responsive physics, and glassmorphic precision.",
    tags: ["Figma", "Tailwind CSS", "Framer Motion", "Design Systems"],
  },
];

export function ServicesSection() {
  const theme = useStudioStore((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <section id="services" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-2xl mb-16">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00e5a3]" />
          <span
            className={`text-xs font-semibold uppercase tracking-[0.2em] ${
              isDark ? "text-[#00e5a3]" : "text-[#0d9488]"
            }`}
          >
            Capabilities
          </span>
        </div>
        <h2
          className={`font-display text-3xl md:text-5xl font-bold tracking-tight ${
            isDark ? "text-white" : "text-slate-950"
          }`}
        >
          Crafting at the Intersection of Design, 3D & Artificial Intelligence.
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SERVICES.map((service, idx) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`group relative flex flex-col justify-between rounded-2xl border p-8 backdrop-blur-xl transition-all duration-300 ${
                isDark
                  ? "border-white/[0.08] bg-[#0c1017]/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-[#00e5a3]/40 hover:bg-[#0f1520]"
                  : "border-slate-200/80 bg-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:border-[#00e5a3] hover:shadow-xl"
              }`}
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#00e5a3]/30 bg-[#00e5a3]/10 text-[#00e5a3] shadow-[0_0_16px_rgba(0,229,163,0.15)] mb-6 transition-all group-hover:scale-110 group-hover:border-[#00e5a3]/60">
                  <Icon size={22} />
                </div>

                <h3
                  className={`font-display text-xl font-bold transition-colors mb-3 ${
                    isDark
                      ? "text-white group-hover:text-[#00e5a3]"
                      : "text-slate-900 group-hover:text-[#0d9488]"
                  }`}
                >
                  {service.title}
                </h3>

                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-white/60" : "text-slate-600"
                  }`}
                >
                  {service.description}
                </p>
              </div>

              {/* Tags */}
              <div
                className={`flex flex-wrap gap-2 pt-6 mt-6 border-t ${
                  isDark ? "border-white/[0.06]" : "border-slate-100"
                }`}
              >
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium ${
                      isDark
                        ? "border-white/[0.06] bg-white/[0.02] text-white/50"
                        : "border-slate-200 bg-slate-50 text-slate-600"
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
