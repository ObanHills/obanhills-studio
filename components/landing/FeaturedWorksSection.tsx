"use client";
// components/landing/FeaturedWorksSection.tsx
// Curated Selected Works showcase grid with theme adaptation, category filter, and instant detail panel opening.

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Heart, Layers, ArrowUpRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useStudioStore } from "@/lib/store";
import type { Project } from "@/types";

interface FeaturedWorksSectionProps {
  projects: Project[];
}

export function FeaturedWorksSection({ projects }: FeaturedWorksSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { setActiveProject, theme } = useStudioStore();
  const isDark = theme === "dark";

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <section id="works" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div
        className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b pb-8 ${
          isDark ? "border-white/[0.08]" : "border-slate-200"
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00e5a3]" />
            <span
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                isDark ? "text-[#00e5a3]" : "text-[#0d9488]"
              }`}
            >
              Portfolio Showcase
            </span>
          </div>
          <h2
            className={`font-display text-3xl md:text-5xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-slate-950"
            }`}
          >
            Selected Works & Experiments
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
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

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map((project, idx) => {
            const galleryCount = (project.gallery_images || []).length;

            return (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => setActiveProject(project.slug)}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border backdrop-blur-xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 ${
                  isDark
                    ? "border-white/[0.08] bg-[#0c1017]/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-[#00e5a3]/40 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6),0_0_24px_rgba(0,229,163,0.12)]"
                    : "border-slate-200/80 bg-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:border-[#00e5a3] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12),0_0_16px_rgba(0,229,163,0.15)]"
                }`}
              >
                {/* Media Container */}
                <div
                  className={`relative aspect-[16/10] w-full overflow-hidden ${
                    isDark ? "bg-[#07090e]" : "bg-slate-100"
                  }`}
                >
                  {project.cover_image_url ? (
                    <Image
                      src={project.cover_image_url}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div
                      className={`flex h-full w-full items-center justify-center ${
                        isDark ? "text-white/20" : "text-slate-300"
                      }`}
                    >
                      <ImageIcon size={32} />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${
                      isDark
                        ? "from-[#0c1017] via-transparent to-transparent opacity-80"
                        : "from-white/60 via-transparent to-transparent opacity-60"
                    }`}
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="rounded-md border border-black/40 bg-black/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#00e5a3] backdrop-blur-md">
                      {project.category || "Creative"}
                    </span>

                    {galleryCount > 0 && (
                      <span className="rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-md">
                        +{galleryCount} assets
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className={`font-display text-lg font-bold transition-colors leading-tight ${
                        isDark
                          ? "text-white group-hover:text-[#00e5a3]"
                          : "text-slate-900 group-hover:text-[#0d9488]"
                      }`}
                    >
                      {project.title}
                    </h3>
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all ${
                        isDark
                          ? "border-white/10 bg-white/[0.04] text-white/40 group-hover:border-[#00e5a3]/40 group-hover:bg-[#00e5a3]/20 group-hover:text-[#00e5a3]"
                          : "border-slate-200 bg-slate-100 text-slate-500 group-hover:border-[#00e5a3] group-hover:bg-[#00e5a3]/15 group-hover:text-[#008f66]"
                      }`}
                    >
                      <ArrowUpRight size={14} />
                    </div>
                  </div>

                  <p
                    className={`line-clamp-2 text-xs leading-relaxed ${
                      isDark ? "text-white/55" : "text-slate-600"
                    }`}
                  >
                    {project.description}
                  </p>

                  {/* Footer metadata */}
                  <div
                    className={`mt-auto pt-3 border-t flex items-center justify-between text-xs ${
                      isDark ? "border-white/[0.06] text-white/40" : "border-slate-100 text-slate-500"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-purple-500 font-medium">
                      <Heart size={12} className="fill-purple-500/40" />
                      <span>{project.likes_count} likes</span>
                    </span>

                    <span
                      className={`text-[11px] font-semibold group-hover:underline ${
                        isDark ? "text-[#00e5a3]" : "text-[#0d9488]"
                      }`}
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
