"use client";
// components/landing/FeaturedWorksSection.tsx
// Selected Works — featured spotlight + filterable grid.
//
// Both the spotlight and grid cards use a fanned multi-panel image layout:
// up to 3 images (cover + gallery) are displayed as overlapping vertical
// panels with slight rotation and offset — giving each card genuine depth.
// Panels spread slightly on hover for a premium reveal effect.

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowUpRight, Image as ImageIcon, Images } from "lucide-react";
import Image from "next/image";
import { useStudioStore } from "@/lib/store";
import type { Project } from "@/types";

interface FeaturedWorksSectionProps {
  projects: Project[];
}

// ── Fanned Panels ─────────────────────────────────────────────────────────────
// Renders up to 3 images as overlapping vertical panels with depth.
// `spread` controls how far back panels are offset (hover state = more spread).
interface FannedPanelsProps {
  images: string[];         // [cover, ...gallery] — max 3 used
  title: string;
  accent: string;
  hovered: boolean;
  priority?: boolean;
  tall?: boolean;           // taller aspect for the spotlight
}

function FannedPanels({ images, title, accent, hovered, priority = false, tall = false }: FannedPanelsProps) {
  const panels = images.slice(0, 3);
  const count = panels.length;
  const height = tall ? "min-h-[300px] lg:min-h-[380px]" : "aspect-[3/4]";

  // Panel layout configs: [rotation, xOffset%, zIndex, opacity, scale]
  // Back → front order. Adjustments per panel count for clean composition.
  const configs: [number, number, number, number, number][] =
    count === 1
      ? [[0, 0, 3, 1, 1]]
      : count === 2
      ? [[-6, hovered ? -28 : -18, 1, 0.75, 0.93], [3, hovered ? 8 : 4, 3, 1, 1]]
      : [
          [-10, hovered ? -42 : -28, 1, 0.6, 0.88],
          [-4, hovered ? -14 : -8,  2, 0.82, 0.95],
          [4,  hovered ? 12 : 6,   3, 1,    1],
        ];

  return (
    <div className={`relative w-full ${height} flex items-stretch`}>
      {panels.map((src, i) => {
        const [rot, xOff, zIdx, opacity, scale] = configs[i] ?? configs[configs.length - 1];
        return (
          <motion.div
            key={src + i}
            animate={{
              rotate: rot,
              x: `${xOff}%`,
              opacity,
              scale,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            style={{
              zIndex: zIdx,
              position: i === 0 ? "relative" : "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              originX: "50%",
              originY: "bottom",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)`,
            }}
          >
            <Image
              src={src}
              alt={`${title} — image ${i + 1}`}
              fill
              priority={priority && i === panels.length - 1}
              className="object-cover"
              unoptimized
            />
            {/* Subtle accent glow on front panel */}
            {i === panels.length - 1 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(160deg, ${accent}18 0%, transparent 60%)`,
                }}
              />
            )}
          </motion.div>
        );
      })}

      {/* Empty state */}
      {count === 0 && (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/5 text-white/20">
          <ImageIcon size={32} />
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function FeaturedWorksSection({ projects }: FeaturedWorksSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const { setActiveProject, theme } = useStudioStore();
  const isDark = theme === "dark";

  const featured = projects[0] ?? null;
  const rest = projects.slice(1);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => { if (p.category) set.add(p.category); });
    return ["All", ...Array.from(set)];
  }, [projects]);

  const gridProjects = useMemo(() => {
    if (selectedCategory === "All") return rest;
    return projects.filter((p) => p.category === selectedCategory);
  }, [rest, projects, selectedCategory]);

  return (
    <section id="works" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto">

      {/* ── Section Header ─────────────────────────────────────────────────── */}
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b pb-8 ${isDark ? "border-white/[0.08]" : "border-slate-200"}`}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00e5a3]" />
            <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? "text-[#00e5a3]" : "text-[#0d9488]"}`}>
              Portfolio Showcase
            </span>
          </div>
          <h2 className={`font-display text-3xl md:text-5xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
            Selected Works & Experiments
          </h2>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "border border-[#00e5a3]/50 bg-[#00e5a3] text-black shadow-[0_0_16px_rgba(0,229,163,0.3)]"
                  : isDark
                  ? "border border-white/[0.08] bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950 shadow-xs"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Featured Spotlight ─────────────────────────────────────────────── */}
      {featured && selectedCategory === "All" && (() => {
        const allImages = [
          featured.cover_image_url,
          ...(featured.gallery_images ?? []),
        ].filter(Boolean) as string[];
        const accent = featured.color ?? "#00e5a3";
        const isHov = hoveredSlug === featured.slug;

        return (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setActiveProject(featured.slug)}
            onMouseEnter={() => setHoveredSlug(featured.slug)}
            onMouseLeave={() => setHoveredSlug(null)}
            className={`group relative mb-8 flex flex-col lg:flex-row overflow-hidden rounded-3xl border cursor-pointer transition-all duration-300 ${
              isDark
                ? "border-white/[0.08] bg-[#0c1017]/90 hover:border-[#00e5a3]/40 shadow-[0_8px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_64px_rgba(0,0,0,0.7),0_0_32px_rgba(0,229,163,0.12)]"
                : "border-slate-200/80 bg-white/95 hover:border-[#00e5a3] shadow-[0_4px_32px_rgba(0,0,0,0.07)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.13),0_0_20px_rgba(0,229,163,0.12)]"
            }`}
          >
            {/* Fanned panels — left column */}
            <div
              className={`relative w-full lg:w-[52%] shrink-0 flex items-center justify-center p-8 lg:p-10 overflow-hidden ${
                isDark ? "bg-[#070b10]" : "bg-slate-50"
              }`}
            >
              {/* Accent glow behind panels */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse 70% 60% at 55% 55%, ${accent}22 0%, transparent 70%)`,
                }}
              />

              {/* Featured badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00e5a3]/50 bg-[#00e5a3]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#00e5a3] backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00e5a3] shadow-[0_0_6px_#00e5a3]" />
                  Featured Work
                </span>
              </div>

              {/* Gallery count badge */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur-md">
                  <Images size={11} />
                  {allImages.length} images
                </div>
              )}

              <div className="relative w-[85%] max-w-xs" style={{ height: "320px" }}>
                <FannedPanels
                  images={allImages}
                  title={featured.title}
                  accent={accent}
                  hovered={isHov}
                  priority
                  tall
                />
              </div>
            </div>

            {/* Text panel */}
            <div className="flex flex-col justify-between gap-6 p-8 lg:p-10 flex-1">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
                  {featured.category || "Creative"}
                </span>
                <h3 className={`font-display text-2xl sm:text-3xl font-bold leading-tight transition-colors ${isDark ? "text-white group-hover:text-[#00e5a3]" : "text-slate-900 group-hover:text-[#0d9488]"}`}>
                  {featured.title}
                </h3>
                <p className={`text-sm leading-relaxed line-clamp-3 ${isDark ? "text-white/60" : "text-slate-600"}`}>
                  {featured.description}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-xs text-purple-500 font-medium">
                  <Heart size={13} className="fill-purple-500/40" />
                  {featured.likes_count} likes
                </span>
                <div
                  className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all"
                  style={{
                    borderColor: `${accent}55`,
                    background: `${accent}18`,
                    color: isDark ? accent : `${accent}cc`,
                  }}
                >
                  <span>Open Case Study</span>
                  <ArrowUpRight size={13} />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })()}

      {/* ── Grid ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {gridProjects.map((project, idx) => {
            const allImages = [
              project.cover_image_url,
              ...(project.gallery_images ?? []),
            ].filter(Boolean) as string[];
            const accent = project.color ?? "#00e5a3";
            const isHov = hoveredSlug === project.slug;

            return (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => setActiveProject(project.slug)}
                onMouseEnter={() => setHoveredSlug(project.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 hover:-translate-y-1.5 ${
                  isDark
                    ? "border-white/[0.08] bg-[#0c1017]/90 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-[#00e5a3]/40 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6),0_0_24px_rgba(0,229,163,0.12)]"
                    : "border-slate-200/80 bg-white/95 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:border-[#00e5a3] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12),0_0_16px_rgba(0,229,163,0.15)]"
                }`}
              >
                {/* Fanned panel image area */}
                <div
                  className={`relative w-full flex items-center justify-center overflow-hidden px-6 pt-8 pb-4 ${
                    isDark ? "bg-[#070b10]" : "bg-slate-50"
                  }`}
                  style={{ minHeight: "200px" }}
                >
                  {/* Per-project accent glow */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `radial-gradient(ellipse 80% 70% at 50% 60%, ${accent}1a 0%, transparent 70%)`,
                    }}
                  />

                  {/* Category badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="rounded-md border border-black/40 bg-black/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#00e5a3] backdrop-blur-md">
                      {project.category || "Creative"}
                    </span>
                  </div>

                  {/* Gallery count */}
                  {allImages.length > 1 && (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white/70 backdrop-blur-md">
                      <Images size={10} />
                      {allImages.length}
                    </div>
                  )}

                  <div className="relative w-full" style={{ height: "160px" }}>
                    <FannedPanels
                      images={allImages}
                      title={project.title}
                      accent={accent}
                      hovered={isHov}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`font-display text-lg font-bold transition-colors leading-tight ${isDark ? "text-white group-hover:text-[#00e5a3]" : "text-slate-900 group-hover:text-[#0d9488]"}`}>
                      {project.title}
                    </h3>
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all"
                      style={{
                        borderColor: isHov ? `${accent}66` : isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                        background: isHov ? `${accent}22` : isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9",
                        color: isHov ? accent : isDark ? "rgba(255,255,255,0.4)" : "#64748b",
                      }}
                    >
                      <ArrowUpRight size={14} />
                    </div>
                  </div>

                  <p className={`line-clamp-2 text-xs leading-relaxed ${isDark ? "text-white/55" : "text-slate-600"}`}>
                    {project.description}
                  </p>

                  <div className={`mt-auto pt-3 border-t flex items-center justify-between text-xs ${isDark ? "border-white/[0.06]" : "border-slate-100"}`}>
                    <span className="flex items-center gap-1.5 text-purple-500 font-medium">
                      <Heart size={12} className="fill-purple-500/40" />
                      {project.likes_count} likes
                    </span>
                    <span
                      className="text-[11px] font-semibold group-hover:underline"
                      style={{ color: isDark ? accent : `${accent}cc` }}
                    >
                      View Details →
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
