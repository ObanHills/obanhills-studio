"use client";
// components/admin/GalleryUpload.tsx
// Multi-image upload manager with batch upload, preview grid, set-as-cover, and delete options.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Star, Trash2, Loader2, Plus, Sparkles, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface GalleryUploadProps {
  slug: string;
  coverUrl?: string | null;
  galleryUrls?: string[];
  adminPassword: string;
  onCoverChange: (url: string) => void;
  onGalleryChange: (urls: string[]) => void;
}

export function GalleryUpload({
  slug,
  coverUrl,
  galleryUrls = [],
  adminPassword,
  onCoverChange,
  onGalleryChange,
}: GalleryUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    setUploadingCount((c) => c + 1);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/admin/projects/${encodeURIComponent(slug)}/gallery`, {
        method: "POST",
        headers: { "x-admin-password": adminPassword },
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      if (json.gallery_images) {
        onGalleryChange(json.gallery_images);
        if (!coverUrl && json.new_image_url) {
          onCoverChange(json.new_image_url);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingCount((c) => Math.max(0, c - 1));
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => uploadFile(file));
  };

  const handleDeleteImage = async (url: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${encodeURIComponent(slug)}/gallery`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({ imageUrl: url }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      if (json.gallery_images) {
        onGalleryChange(json.gallery_images);
        if (coverUrl === url) {
          onCoverChange(json.gallery_images[0] || "");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    }
  };

  const allImages = Array.from(new Set([coverUrl, ...galleryUrls].filter(Boolean))) as string[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon size={15} className="text-[#00e5a3]" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
            Media Gallery & 3D Assets ({allImages.length})
          </h3>
        </div>
        <span className="text-[11px] text-white/40">
          Click ★ Star on any image to make it the 3D cover
        </span>
      </div>

      {/* Multi-upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed p-6 transition-all ${
          isDragging
            ? "border-[#00e5a3] bg-[#00e5a3]/10 shadow-[0_0_24px_rgba(0,229,163,0.2)]"
            : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.04]"
        }`}
        onClick={() => document.getElementById("gallery-multi-input")?.click()}
      >
        <input
          id="gallery-multi-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-[#00e5a3] shadow-inner">
          <Upload size={18} />
        </div>

        <div className="text-center">
          <span className="text-xs font-semibold text-white">
            Click to upload or drag & drop files
          </span>
          <p className="mt-0.5 text-[11px] text-white/40">
            Supports PNG, JPG, WebP, GIF • Multiple files supported
          </p>
        </div>

        {uploadingCount > 0 && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#0d1219]/90 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-[#00e5a3]">
              <Loader2 size={16} className="animate-spin" />
              <span>Uploading {uploadingCount} image{uploadingCount > 1 ? "s" : ""} to cloud storage…</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 font-medium">
          <X size={13} /> {error}
        </p>
      )}

      {/* Gallery Grid */}
      {allImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 pt-1">
          <AnimatePresence>
            {allImages.map((url, idx) => {
              const isCover = coverUrl === url;
              return (
                <motion.div
                  key={url}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`group relative aspect-[4/3] overflow-hidden rounded-xl border bg-[#07090e] transition-all ${
                    isCover
                      ? "border-[#00e5a3] shadow-[0_0_16px_rgba(0,229,163,0.25)] ring-1 ring-[#00e5a3]"
                      : "border-white/[0.08] hover:border-white/[0.24]"
                  }`}
                >
                  <Image
                    src={url}
                    alt={`Gallery asset ${idx + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />

                  {/* Cover Tag */}
                  {isCover && (
                    <div className="absolute top-2 left-2 rounded-md bg-[#00e5a3] px-2 py-0.5 text-[9px] font-bold tracking-wider text-black shadow-md uppercase">
                      3D Cover
                    </div>
                  )}

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCoverChange(url);
                        }}
                        title="Set as 3D Scene Cover"
                        className="flex items-center gap-1 rounded-lg bg-white/20 px-2 py-1.5 text-[11px] font-medium text-white hover:bg-[#00e5a3] hover:text-black transition-colors"
                      >
                        <Star size={12} />
                        <span>Cover</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(url);
                      }}
                      title="Delete Image"
                      className="rounded-lg bg-white/20 p-1.5 text-red-300 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
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
