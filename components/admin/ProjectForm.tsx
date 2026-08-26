"use client";
// components/admin/ProjectForm.tsx
// Two-phase project creator:
//   Phase 1 (create): fill details → "Next: Upload Media" → project saved, slug known
//   Phase 2 (upload): GalleryUpload unlocks immediately with the real slug
// Edit mode shows everything in one pass (same as before).

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  X,
  Link2,
  FileText,
  Tag,
  Layers,
  CheckCircle2,
  ArrowRight,
  Upload,
} from "lucide-react";
import { GalleryUpload } from "./GalleryUpload";
import type { Project } from "@/types";

const CATEGORIES = [
  "Development",
  "Design",
  "3D / Creative",
  "AI / ML",
  "Branding",
  "Motion Graphics",
  "Mobile App",
  "Architecture",
];

interface ProjectFormProps {
  project?: Project | null;
  adminPassword: string;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function ProjectForm({ project, adminPassword, onSave, onCancel }: ProjectFormProps) {
  const isEdit = !!project;

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [projectUrl, setProjectUrl] = useState(project?.project_url ?? "");
  const [category, setCategory] = useState(project?.category ?? "Design");
  const [coverImageUrl, setCoverImageUrl] = useState(project?.cover_image_url ?? "");
  const [galleryImages, setGalleryImages] = useState<string[]>(project?.gallery_images ?? []);
  const [slugManual, setSlugManual] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // After a new project is created we flip to upload phase
  const [createdProject, setCreatedProject] = useState<Project | null>(null);
  const phase = isEdit ? "edit" : createdProject ? "upload" : "create";

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManual && title) setSlug(slugify(title));
  }, [title, slugManual]);

  // ── Save core details ──────────────────────────────────────────────────────
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title || !slug || !description) {
      setError("Title, slug, and description are required.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const url = isEdit
        ? `/api/admin/projects/${encodeURIComponent(project!.slug)}`
        : "/api/admin/projects";
      const method = isEdit ? "PUT" : "POST";

      const body = isEdit
        ? {
            title, description, project_url: projectUrl, category,
            cover_image_url: coverImageUrl, gallery_images: galleryImages, new_slug: slug,
          }
        : {
            title, slug, description, project_url: projectUrl, category,
            cover_image_url: coverImageUrl, gallery_images: galleryImages,
          };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-admin-password": adminPassword },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      if (isEdit) {
        onSave(json);
      } else {
        // Move to upload phase — slug is now real and stable
        setCreatedProject(json);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ── Finish after uploads ───────────────────────────────────────────────────
  const handleFinish = () => {
    if (createdProject) {
      onSave({
        ...createdProject,
        cover_image_url: coverImageUrl || createdProject.cover_image_url,
        gallery_images: galleryImages.length ? galleryImages : createdProject.gallery_images,
      });
    }
  };

  // ── Phase 2: upload UI ─────────────────────────────────────────────────────
  if (phase === "upload" && createdProject) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl border border-white/[0.08] bg-[#0d1219]/90 p-6 md:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between border-b border-white/[0.06] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00e5a3] shadow-[0_0_8px_#00e5a3]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00e5a3]">
                Step 2 of 2 — Media Upload
              </span>
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              {createdProject.title}
            </h2>
            <p className="mt-0.5 text-xs text-white/40">
              Project created ✓ — add your cover image and gallery assets below
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleFinish}
              className="flex items-center gap-2 rounded-xl border border-[#00e5a3]/40 bg-[#00e5a3]/20 px-5 py-2.5 text-xs font-semibold text-[#00e5a3] shadow-[0_0_16px_rgba(0,229,163,0.15)] transition-all hover:bg-[#00e5a3]/30"
            >
              <CheckCircle2 size={14} />
              Done — Publish to 3D Scene
            </motion.button>
            <button
              onClick={onCancel}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-2 text-white/40 transition-colors hover:border-white/20 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Gallery upload */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5">
          <GalleryUpload
            slug={createdProject.slug}
            coverUrl={coverImageUrl || null}
            galleryUrls={galleryImages}
            adminPassword={adminPassword}
            onCoverChange={(url) => setCoverImageUrl(url)}
            onGalleryChange={(urls) => setGalleryImages(urls)}
          />
        </div>

        {/* Skip */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-white/30">
            You can always add more images later by editing this project.
          </span>
          <button
            onClick={handleFinish}
            className="text-xs text-white/40 underline underline-offset-2 hover:text-white transition-colors"
          >
            Skip for now →
          </button>
        </div>
      </motion.div>
    );
  }

  // ── Phase 1: create / edit form ────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="relative rounded-3xl border border-white/[0.08] bg-[#0d1219]/90 p-6 md:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00e5a3] shadow-[0_0_8px_#00e5a3]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00e5a3]">
              {isEdit ? "Project Editor" : "Step 1 of 2 — Project Details"}
            </span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            {isEdit ? project!.title : "New Portfolio Project"}
          </h2>
          {!isEdit && (
            <p className="mt-0.5 text-xs text-white/40">
              Fill in the details — you&apos;ll upload images on the next step.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={() => handleSubmit()}
            disabled={saving}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 rounded-xl border border-[#00e5a3]/40 bg-[#00e5a3]/20 px-4 py-2 text-xs font-semibold text-[#00e5a3] shadow-[0_0_16px_rgba(0,229,163,0.15)] transition-all hover:bg-[#00e5a3]/30 disabled:opacity-40"
          >
            {saving
              ? <Loader2 size={14} className="animate-spin" />
              : isEdit ? <Save size={14} /> : <ArrowRight size={14} />}
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Next: Upload Media"}
          </motion.button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-2 text-white/40 transition-colors hover:border-white/20 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-7">
        {/* Gallery — edit mode only */}
        {isEdit && (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5">
            <GalleryUpload
              slug={project!.slug}
              coverUrl={coverImageUrl || null}
              galleryUrls={galleryImages}
              adminPassword={adminPassword}
              onCoverChange={(url) => setCoverImageUrl(url)}
              onGalleryChange={(urls) => setGalleryImages(urls)}
            />
          </div>
        )}

        {/* Core details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/60">
              <FileText size={13} className="text-[#00e5a3]" /> Project Title *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Jos TechFest AI Summit 2025"
              required
              className="admin-input"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/60">
              <Link2 size={13} className="text-[#00d2ff]" /> Slug Identifier *
            </label>
            <input
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
              placeholder="jos-techfest-ai-summit-2025"
              required
              className="admin-input font-mono text-xs"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/60">
              <Tag size={13} className="text-purple-400" /> Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="admin-input cursor-pointer"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/60">
              <Link2 size={13} className="text-cyan-400" /> Live Project URL (Optional)
            </label>
            <input
              type="url"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              placeholder="https://your-live-site.com"
              className="admin-input"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/60">
              <Layers size={13} className="text-[#00e5a3]" /> Project Description *
            </label>
            <span className="text-[11px] text-white/30">{description.length} characters</span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the background, creative approach, tools used, and deliverables…"
            rows={5}
            required
            className="admin-input leading-relaxed resize-none"
          />
        </div>

        {error && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 font-medium">
            {error}
          </p>
        )}

        {/* Sticky footer */}
        <div className="sticky bottom-0 -mx-6 -mb-6 md:-mx-8 md:-mb-8 mt-4 flex items-center justify-between border-t border-white/[0.08] bg-[#0d1219]/95 px-6 md:px-8 py-4 backdrop-blur-xl rounded-b-3xl z-20">
          <div className="text-xs text-white/40">
            {!isEdit
              ? <span className="flex items-center gap-1.5 text-white/50"><Upload size={13} className="text-[#00e5a3]" /> Image upload opens on the next step.</span>
              : <span>All changes sync instantly to the 3D landscape.</span>}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-xs font-medium text-white/60 transition-colors hover:border-white/20 hover:text-white"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={saving}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-xl border border-[#00e5a3]/40 bg-[#00e5a3]/20 px-6 py-2.5 text-xs font-semibold text-[#00e5a3] shadow-[0_0_20px_rgba(0,229,163,0.18)] transition-all hover:bg-[#00e5a3]/30 disabled:opacity-40"
            >
              {saving
                ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                : isEdit
                ? <><Save size={14} /> Save Changes</>
                : <><ArrowRight size={14} /> Next: Upload Media</>}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
