"use client";
// components/admin/ImageUpload.tsx
// Drag-and-drop / click-to-upload image picker for project cover images.

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  slug: string;
  currentUrl?: string | null;
  adminPassword: string;
  onUploadSuccess: (url: string) => void;
}

export function ImageUpload({ slug, currentUrl, adminPassword, onUploadSuccess }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }
      setUploading(true);
      setError(null);
      // Show local preview immediately
      setPreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`/api/admin/projects/${slug}/image`, {
          method: "POST",
          headers: { "x-admin-password": adminPassword },
          body: formData,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        onUploadSuccess(json.cover_image_url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setPreview(currentUrl ?? null);
      } finally {
        setUploading(false);
      }
    },
    [slug, adminPassword, currentUrl, onUploadSuccess]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload]
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
        Cover Image
      </label>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative flex h-44 cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
          isDragging
            ? "border-neon-teal bg-neon-teal/10"
            : "border-white/10 bg-white/3 hover:border-white/20"
        }`}
        onClick={() => document.getElementById("cover-file-input")?.click()}
      >
        <input
          id="cover-file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
        />

        <AnimatePresence>
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
            >
              <Image src={preview} alt="Cover preview" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-xs text-white font-semibold">Change image</span>
              </div>
            </motion.div>
          ) : (
            <motion.div key="placeholder" className="flex flex-col items-center gap-2 text-white/30">
              <ImageIcon size={28} />
              <span className="text-xs">Drag & drop or click to upload</span>
            </motion.div>
          )}
        </AnimatePresence>

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neon-teal border-t-transparent" />
          </div>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400">
          <X size={12} /> {error}
        </p>
      )}

      {uploading && (
        <p className="flex items-center gap-1.5 text-xs text-white/40">
          <Upload size={12} className="animate-bounce" /> Uploading to Supabase Storage…
        </p>
      )}
    </div>
  );
}
