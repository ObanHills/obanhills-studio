"use client";
// components/ui/CommentSection.tsx
// Displays comments for the active project with Supabase Realtime live feed and dark/light mode adaptation.

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { useComments } from "@/hooks/useComments";
import { useStudioStore } from "@/lib/store";

interface CommentSectionProps {
  projectSlug: string;
  projectId: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function CommentSection({ projectSlug, projectId }: CommentSectionProps) {
  const { comments, isLoading, postComment } = useComments(projectSlug, projectId);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const theme = useStudioStore((s) => s.theme);
  const isDark = theme === "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await postComment(content, author || undefined);
      setContent("");
      setAuthor("");
    } catch {
      setSubmitError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div
        className={`flex items-center gap-2 ${
          isDark ? "text-white/70" : "text-slate-700 font-medium"
        }`}
      >
        <MessageCircle size={14} className={isDark ? "text-[#00e5a3]" : "text-[#0d9488]"} />
        <span className="font-display text-xs font-semibold tracking-wider uppercase">
          {isLoading ? "Loading…" : `${comments.length} Comment${comments.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Comment form */}
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-2 rounded-xl border p-3 ${
          isDark
            ? "border-white/[0.08] bg-white/[0.03]"
            : "border-slate-200 bg-slate-50 shadow-xs"
        }`}
      >
        <input
          type="text"
          placeholder="Your name (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={60}
          className={`w-full rounded-lg border px-3 py-2 text-xs outline-none transition-colors ${
            isDark
              ? "border-white/10 bg-transparent text-white/90 placeholder-white/30 focus:border-[#00e5a3]/50"
              : "border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#00e5a3]"
          }`}
        />
        <textarea
          ref={textareaRef}
          placeholder="Leave a thought or feedback on this project…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          maxLength={500}
          required
          className={`w-full resize-none rounded-lg border px-3 py-2 text-xs outline-none transition-colors ${
            isDark
              ? "border-white/10 bg-transparent text-white/90 placeholder-white/30 focus:border-[#00e5a3]/50"
              : "border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#00e5a3]"
          }`}
        />
        {submitError && (
          <p className="text-xs text-red-500 font-medium">{submitError}</p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span
            className={`text-[10px] ${
              isDark ? "text-white/30" : "text-slate-400"
            }`}
          >
            {content.length}/500
          </span>
          <motion.button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              isDark
                ? "border-[#00e5a3]/40 bg-[#00e5a3]/15 text-[#00e5a3] hover:bg-[#00e5a3]/25"
                : "border-[#00e5a3]/60 bg-[#00e5a3]/20 text-[#008f66] hover:bg-[#00e5a3]/30"
            }`}
          >
            {isSubmitting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Send size={12} />
            )}
            {isSubmitting ? "Posting…" : "Post Comment"}
          </motion.button>
        </div>
      </form>

      {/* Comment list */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
        <AnimatePresence initial={false}>
          {isLoading && comments.length === 0 && (
            <div className="flex justify-center py-4">
              <Loader2
                size={16}
                className={`animate-spin ${isDark ? "text-white/30" : "text-slate-400"}`}
              />
            </div>
          )}
          {!isLoading && comments.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`py-3 text-center text-xs ${
                isDark ? "text-white/30" : "text-slate-400"
              }`}
            >
              No comments yet. Be the first to share your thoughts!
            </motion.p>
          )}
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className={`rounded-xl border p-3.5 ${
                isDark
                  ? "border-white/[0.06] bg-white/[0.02]"
                  : "border-slate-200 bg-slate-50/80 shadow-xs"
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span
                  className={`text-xs font-semibold truncate ${
                    isDark ? "text-[#00e5a3]" : "text-[#0d9488]"
                  }`}
                >
                  {comment.author_name}
                </span>
                <span
                  className={`shrink-0 text-[10px] ${
                    isDark ? "text-white/30" : "text-slate-400"
                  }`}
                >
                  {timeAgo(comment.created_at)}
                </span>
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  isDark ? "text-white/70" : "text-slate-700"
                }`}
              >
                {comment.content}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
