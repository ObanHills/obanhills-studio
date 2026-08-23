"use client";
// components/ui/ProjectPanel.tsx
// Slide-in right-side panel showing full project detail with dark and light mode adaptation.
// Features multi-image carousel slider, lightbox expand, likes, real-time comments, and external links.

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Calendar, ChevronLeft, ChevronRight, Maximize2, Tag } from "lucide-react";
import Image from "next/image";
import { useStudioStore } from "@/lib/store";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

export function ProjectPanel() {
  const { projects, activeProjectSlug, setActiveProject, isPanelOpen, theme } =
    useStudioStore();
  const isDark = theme === "dark";

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const project = activeProjectSlug
    ? projects.find((p) => p.slug === activeProjectSlug) ?? null
    : null;

  // Reset active image when switching projects
  useEffect(() => {
    setActiveImageIndex(0);
    setLightboxOpen(false);
  }, [activeProjectSlug]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxOpen) {
          setLightboxOpen(false);
        } else {
          setActiveProject(null);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setActiveProject, lightboxOpen]);

  const allImages = useMemo(() => {
    if (!project) return [];
    const list = [project.cover_image_url, ...(project.gallery_images || [])].filter(Boolean) as string[];
    return Array.from(new Set(list));
  }, [project]);

  const formattedDate = project
    ? new Date(project.created_at).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <AnimatePresence>
      {isPanelOpen && project && (
        <>
          {/* Backdrop (mobile) */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProject(null)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[2px] md:hidden"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className={`fixed right-0 top-0 z-40 h-full w-full overflow-y-auto shadow-2xl backdrop-blur-2xl sm:w-[440px] transition-colors ${
              isDark
                ? "border-l border-white/[0.08] bg-[#0c1017]/95 text-white"
                : "border-l border-slate-200 bg-white/95 text-slate-900"
            }`}
          >
            {/* Top accent line */}
            <div
              className="h-[2px] w-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${project.color ?? "#00e5a3"}, transparent)`,
                boxShadow: `0 0 12px ${project.color ?? "#00e5a3"}80`,
              }}
            />

            {/* Media Gallery / Image Carousel */}
            {allImages.length > 0 && (
              <div
                className={`relative h-56 w-full overflow-hidden border-b select-none group ${
                  isDark ? "border-white/10 bg-[#07090e]" : "border-slate-200 bg-slate-100"
                }`}
              >
                <Image
                  src={allImages[activeImageIndex] || allImages[0]}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${
                    isDark
                      ? "from-[#0c1017] via-transparent to-black/30"
                      : "from-white/80 via-transparent to-black/10"
                  }`}
                />

                {/* Carousel Controls if multiple images */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white/80 hover:bg-[#00e5a3] hover:text-black transition-colors backdrop-blur-sm"
                      title="Previous"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white/80 hover:bg-[#00e5a3] hover:text-black transition-colors backdrop-blur-sm"
                      title="Next"
                    >
                      <ChevronRight size={16} />
                    </button>
                    {/* Index Pill */}
                    <div className="absolute bottom-2.5 right-3 rounded-full bg-black/75 px-2.5 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
                      {activeImageIndex + 1} / {allImages.length}
                    </div>
                  </>
                )}

                {/* Lightbox Trigger */}
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute bottom-2.5 left-3 flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-medium text-white/90 hover:text-[#00e5a3] backdrop-blur-sm transition-colors"
                >
                  <Maximize2 size={11} /> Expand
                </button>
              </div>
            )}

            {/* Thumbnail Strip if multiple images */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto px-6 pt-3 pb-1 scrollbar-thin">
                {allImages.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border transition-all ${
                      activeImageIndex === i
                        ? "border-[#00e5a3] shadow-[0_0_8px_rgba(0,229,163,0.4)] ring-1 ring-[#00e5a3]"
                        : isDark
                        ? "border-white/10 opacity-50 hover:opacity-100"
                        : "border-slate-300 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${i + 1}`} fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-6 p-6">
              {/* Header row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  {/* Category / Node color dot */}
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full shadow-[0_0_6px]"
                      style={{
                        background: project.color,
                        boxShadow: `0 0 8px ${project.color}`,
                      }}
                    />
                    <span
                      className={`text-[10px] tracking-widest uppercase font-display font-semibold ${
                        isDark ? "text-white/40" : "text-slate-500"
                      }`}
                    >
                      {project.category || "Project"}
                    </span>
                  </div>
                  <h2
                    className={`font-display text-2xl font-bold leading-tight ${
                      isDark ? "text-white" : "text-slate-950"
                    }`}
                  >
                    {project.title}
                  </h2>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setActiveProject(null)}
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white"
                      : "border-slate-200 bg-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-900"
                  }`}
                  aria-label="Close panel"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Divider */}
              <div
                className="h-px w-full opacity-30"
                style={{ background: project.color }}
              />

              {/* Description */}
              <p
                className={`text-sm leading-relaxed whitespace-pre-line ${
                  isDark ? "text-white/75" : "text-slate-700"
                }`}
              >
                {project.description}
              </p>

              {/* Meta row */}
              <div className="flex items-center justify-between gap-4">
                <div
                  className={`flex items-center gap-1.5 text-xs ${
                    isDark ? "text-white/40" : "text-slate-500"
                  }`}
                >
                  <Calendar size={12} />
                  <span>{formattedDate}</span>
                </div>
                <LikeButton slug={project.slug} count={project.likes_count} />
              </div>

              {/* Live Project URL if available */}
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#00e5a3]/40 bg-[#00e5a3]/10 py-3 text-xs font-semibold tracking-wider text-[#008f66] dark:text-[#00e5a3] transition-colors hover:bg-[#00e5a3]/20 shadow-xs"
                >
                  <ExternalLink size={13} />
                  View Live Project
                </a>
              )}

              {/* Comments */}
              <div
                className={`border-t pt-2 ${
                  isDark ? "border-white/[0.08]" : "border-slate-200"
                }`}
              >
                <CommentSection
                  projectSlug={project.slug}
                  projectId={project.id}
                />
              </div>
            </div>
          </motion.aside>

          {/* Fullscreen Lightbox Modal */}
          <AnimatePresence>
            {lightboxOpen && allImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8"
                onClick={() => setLightboxOpen(false)}
              >
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>

                <div
                  className="relative h-full max-h-[85vh] w-full max-w-5xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={allImages[activeImageIndex]}
                    alt={project.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white hover:bg-[#00e5a3] hover:text-black transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white hover:bg-[#00e5a3] hover:text-black transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-xs text-white/90">
                        {activeImageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
