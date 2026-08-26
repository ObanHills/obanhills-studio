"use client";
// components/landing/FeaturedWorksSection.tsx
// Auto-scrolling horizontal carousel — every project gets the full spotlight
// treatment: fanned image panels on the left, title + description + CTA on the right.
//
// Behaviour:
//  - Auto-scrolls at a steady pace using rAF (pauses on hover / touch / drag)
//  - Drag-to-scroll on desktop (pointer events)
//  - Touch-scroll on mobile (native, momentum preserved)
//  - Seamless loop: the card list is duplicated so the scroll never hits an end
//  - Category filters narrow which cards are shown (loop resets on filter change)

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart, ArrowUpRight, Image as ImageIcon, Images } from "lucide-react";
import Image from "next/image";
import { useStudioStore } from "@/lib/store";
import type { Project } from "@/types";

interface FeaturedWorksSectionProps {
  projects: Project[];
}

// ── Fanned Panels (same component as before) ─────────────────────────────────
interface FannedPanelsProps {
  images: string[];
  title: string;
  accent: string;
  hovered: boolean;
  priority?: boolean;
}

function FannedPanels({ images, title, accent, hovered, priority = false }: FannedPanelsProps) {
  const panels = images.slice(0, 3);
  const count = panels.length;

  const configs: [number, number, number, number, number][] =
    count === 1
      ? [[0, 0, 3, 1, 1]]
      : count === 2
      ? [[-6, hovered ? -28 : -18, 1, 0.75, 0.93],
         [3,  hovered ? 8  : 4,   3, 1,    1   ]]
      : [[-10, hovered ? -42 : -28, 1, 0.6,  0.88],
         [-4,  hovered ? -14 : -8,  2, 0.82, 0.95],
         [4,   hovered ? 12  : 6,   3, 1,    1   ]];

  return (
    <div className="relative w-full h-full flex items-stretch">
      {panels.map((src, i) => {
        const [rot, xOff, zIdx, opacity, scale] = configs[i] ?? configs[configs.length - 1];
        return (
          <motion.div
            key={src + i}
            animate={{ rotate: rot, x: `${xOff}%`, opacity, scale }}
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
              boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
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
            {i === panels.length - 1 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `linear-gradient(160deg, ${accent}18 0%, transparent 60%)` }}
              />
            )}
          </motion.div>
        );
      })}
      {count === 0 && (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/5 text-white/20">
          <ImageIcon size={28} />
        </div>
      )}
    </div>
  );
}

// ── Single carousel card ──────────────────────────────────────────────────────
function ProjectCard({
  project,
  onOpen,
  isDark,
  priority,
}: {
  project: Project;
  onOpen: (slug: string) => void;
  isDark: boolean;
  priority?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const accent = project.color ?? "#00e5a3";
  const allImages = [
    project.cover_image_url,
    ...(project.gallery_images ?? []),
  ].filter(Boolean) as string[];

  return (
    <div
      className={`relative flex flex-col lg:flex-row overflow-hidden rounded-3xl border cursor-pointer transition-all duration-300 shrink-0 ${
        isDark
          ? "border-white/[0.08] bg-[#0c1017]/90 hover:border-[#00e5a3]/30 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
          : "border-slate-200/80 bg-white/95 hover:border-slate-300 shadow-[0_4px_32px_rgba(0,0,0,0.07)]"
      }`}
      style={{ width: "min(820px, 88vw)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(project.slug)}
    >
      {/* Fanned image panel — left */}
      <div
        className={`relative shrink-0 flex items-center justify-center overflow-hidden p-8 ${
          isDark ? "bg-[#070b10]" : "bg-slate-50"
        }`}
        style={{ width: "min(340px, 42%)", minHeight: "280px" }}
      >
        {/* Accent glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 70% 65% at 55% 55%, ${accent}22 0%, transparent 70%)`,
          }}
        />

        {/* Gallery count */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white/70 backdrop-blur-md">
            <Images size={10} />
            {allImages.length}
          </div>
        )}

        <div className="relative w-[80%]" style={{ height: "200px" }}>
          <FannedPanels
            images={allImages}
            title={project.title}
            accent={accent}
            hovered={hovered}
            priority={priority}
          />
        </div>
      </div>

      {/* Gradient bridge */}
      <div
        className={`hidden lg:block absolute inset-y-0 pointer-events-none`}
        style={{
          left: "min(340px, 42%)",
          width: "80px",
          background: isDark
            ? "linear-gradient(90deg, #070b10, transparent)"
            : "linear-gradient(90deg, #f8fafc, transparent)",
          zIndex: 2,
        }}
      />

      {/* Text panel — right */}
      <div className="flex flex-col justify-between gap-5 p-8 lg:p-9 flex-1 relative z-10">
        <div className="flex flex-col gap-4">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: accent }}
          >
            {project.category || "Creative"}
          </span>

          <h3
            className={`font-display text-2xl font-bold leading-tight transition-colors ${
              isDark ? "text-white" : "text-slate-900"
            }`}
            style={{ color: hovered ? accent : undefined }}
          >
            {project.title}
          </h3>

          <p className={`text-sm leading-relaxed line-clamp-3 ${isDark ? "text-white/55" : "text-slate-600"}`}>
            {project.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-xs text-purple-500 font-medium">
            <Heart size={12} className="fill-purple-500/40" />
            {project.likes_count} likes
          </span>

          <motion.div
            whileHover={{ x: 2 }}
            className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all"
            style={{
              borderColor: `${accent}55`,
              background: hovered ? `${accent}28` : `${accent}14`,
              color: isDark ? accent : `${accent}cc`,
            }}
          >
            Open Case Study
            <ArrowUpRight size={13} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const SCROLL_SPEED = 0.6; // px per frame at 60fps

export function FeaturedWorksSection({ projects }: FeaturedWorksSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { setActiveProject, theme } = useStudioStore();
  const isDark = theme === "dark";

  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollStart = useRef(0);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => { if (p.category) set.add(p.category); });
    return ["All", ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  // Auto-scroll loop
  const startLoop = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const tick = () => {
      if (!pausedRef.current && el) {
        el.scrollLeft += SCROLL_SPEED;
        // Seamless loop: when we've scrolled half the duplicated list, reset to 0
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  }, []);

  // Reset scroll and restart loop when filter changes
  useEffect(() => {
    const el = trackRef.current;
    if (el) el.scrollLeft = 0;
    cancelAnimationFrame(animRef.current);
    startLoop();
    return () => cancelAnimationFrame(animRef.current);
  }, [filtered, startLoop]);

  // Pause / resume on hover
  const pause = () => { pausedRef.current = true; };
  const resume = () => { if (!isDragging.current) pausedRef.current = false; };

  // Drag-to-scroll (desktop)
  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    isDragging.current = true;
    pausedRef.current = true;
    dragStartX.current = e.clientX;
    dragScrollStart.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const el = trackRef.current;
    if (!el) return;
    const delta = dragStartX.current - e.clientX;
    el.scrollLeft = dragScrollStart.current + delta;
  };

  const onPointerUp = () => {
    isDragging.current = false;
    pausedRef.current = false;
  };

  return (
    <section id="works" className="relative py-24 overflow-hidden">

      {/* Header */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b pb-8 ${isDark ? "border-white/[0.08]" : "border-slate-200"}`}>
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

          {/* Category filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
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
      </div>

      {/* Carousel track — edge fade masks */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="pointer-events-none absolute left-0 inset-y-0 w-16 z-10"
          style={{
            background: isDark
              ? "linear-gradient(90deg, #07090e, transparent)"
              : "linear-gradient(90deg, #faf9f7, transparent)",
          }}
        />
        {/* Right fade */}
        <div
          className="pointer-events-none absolute right-0 inset-y-0 w-16 z-10"
          style={{
            background: isDark
              ? "linear-gradient(270deg, #07090e, transparent)"
              : "linear-gradient(270deg, #faf9f7, transparent)",
          }}
        />

        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto px-6 md:px-12 pb-4 select-none"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            cursor: isDragging.current ? "grabbing" : "grab",
            WebkitOverflowScrolling: "touch",
          }}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Render list twice for seamless loop */}
          {[...filtered, ...filtered].map((project, idx) => (
            <ProjectCard
              key={`${project.slug}-${idx}`}
              project={project}
              onOpen={setActiveProject}
              isDark={isDark}
              priority={idx < 2}
            />
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto mt-5 flex items-center gap-2">
        <span className={`text-[10px] uppercase tracking-[0.18em] font-medium ${isDark ? "text-white/25" : "text-slate-400"}`}>
          Drag to explore
        </span>
        <div className={`h-px flex-1 max-w-[80px] ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
      </div>
    </section>
  );
}
