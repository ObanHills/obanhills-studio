"use client";
// components/admin/ProjectList.tsx
// Luxury portfolio manager list with category filtering, live search, stats, and sleek interactive cards.

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Search,
  Heart,
  Calendar,
  Layers,
  Sparkles,
  Check,
  Copy,
} from "lucide-react";
import Image from "next/image";
import type { Project } from "@/types";

interface ProjectListProps {
  projects: Project[];
  adminPassword: string;
  onEdit: (project: Project) => void;
  onDeleted: (slug: string) => void;
}

export function ProjectList({
  projects,
  adminPassword,
  onEdit,
  onDeleted,
}: ProjectListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Extract all categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      const matchQuery =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [projects, selectedCategory, searchQuery]);

  const handleDelete = async (slug: string) => {
    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/admin/projects/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers: { "x-admin-password": adminPassword },
      });
      if (!res.ok) throw new Error("Delete failed");
      onDeleted(slug);
    } catch (err) {
      console.error("[handleDelete]", err);
    } finally {
      setDeletingSlug(null);
      setConfirmSlug(null);
    }
  };

  const copySlug = (slug: string) => {
    navigator.clipboard.writeText(slug);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls: Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            placeholder="Search projects by title, keyword, or slug…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 pl-10 text-xs text-white placeholder-white/25 outline-none transition-colors focus:border-[#00e5a3]/50 focus:bg-white/[0.05]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "border border-[#00e5a3]/40 bg-[#00e5a3]/15 text-[#00e5a3] shadow-[0_0_12px_rgba(0,229,163,0.15)]"
                  : "border border-white/[0.06] bg-white/[0.02] text-white/50 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid / List */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] py-20 text-center text-white/30">
          <Layers size={36} className="text-white/20" />
          <p className="text-sm font-medium">No matching projects found</p>
          <span className="text-xs text-white/20">
            Try adjusting your search terms or category filter
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence initial={false}>
            {filteredProjects.map((project) => {
              const galleryCount = (project.gallery_images || []).length;
              const hasMedia = project.cover_image_url || galleryCount > 0;

              return (
                <motion.div
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="group relative flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 rounded-2xl border border-white/[0.08] bg-[#0d1219]/80 p-4 md:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.16] hover:bg-[#0f1620]"
                >
                  {/* Left: Thumbnail & Project Meta */}
                  <div className="flex items-start md:items-center gap-4 min-w-0 flex-1">
                    {/* Media Thumbnail */}
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-[#07090e]">
                      {project.cover_image_url ? (
                        <Image
                          src={project.cover_image_url}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-white/20">
                          <ImageIcon size={20} />
                          <span className="text-[9px] uppercase">No Cover</span>
                        </div>
                      )}

                      {/* Image Count Pill */}
                      {galleryCount > 0 && (
                        <div className="absolute bottom-1 right-1 rounded-md bg-black/80 px-1.5 py-0.5 text-[9px] font-semibold text-white/80 backdrop-blur-xs">
                          +{galleryCount}
                        </div>
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-display text-base font-bold text-white group-hover:text-[#00e5a3] transition-colors truncate">
                          {project.title}
                        </h3>
                        {project.category && (
                          <span className="rounded-full border border-[#00e5a3]/30 bg-[#00e5a3]/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-[#00e5a3]">
                            {project.category}
                          </span>
                        )}
                      </div>

                      <p className="line-clamp-2 text-xs leading-relaxed text-white/50">
                        {project.description}
                      </p>

                      {/* Micro Info Chips */}
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {/* Slug Chip with Copy */}
                        <button
                          onClick={() => copySlug(project.slug)}
                          className="flex items-center gap-1 font-mono text-[10px] text-white/35 hover:text-white transition-colors"
                          title="Click to copy slug"
                        >
                          <span>/{project.slug}</span>
                          {copiedSlug === project.slug ? (
                            <Check size={10} className="text-[#00e5a3]" />
                          ) : (
                            <Copy size={10} />
                          )}
                        </button>

                        {/* Likes */}
                        <span className="flex items-center gap-1 text-[10px] text-purple-400/70 font-medium">
                          <Heart size={10} className="fill-purple-400/40" />
                          <span>{project.likes_count} likes</span>
                        </span>

                        {/* Live URL */}
                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                          >
                            <ExternalLink size={10} /> Live Link
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-end gap-2 shrink-0 border-t border-white/[0.06] pt-3 md:border-t-0 md:pt-0">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onEdit(project)}
                      className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/80 transition-all hover:border-[#00e5a3]/40 hover:bg-[#00e5a3]/10 hover:text-[#00e5a3]"
                    >
                      <Pencil size={13} /> Edit
                    </motion.button>

                    {confirmSlug === project.slug ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDelete(project.slug)}
                          disabled={deletingSlug === project.slug}
                          className="flex items-center gap-1 rounded-xl border border-red-500/40 bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/30"
                        >
                          {deletingSlug === project.slug ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                          Delete
                        </button>
                        <button
                          onClick={() => setConfirmSlug(null)}
                          className="rounded-xl border border-white/10 px-2.5 py-2 text-xs text-white/40 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmSlug(project.slug)}
                        title="Delete project"
                        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-white/30 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
