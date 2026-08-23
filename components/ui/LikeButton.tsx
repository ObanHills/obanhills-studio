"use client";
// components/ui/LikeButton.tsx
// Animated heart like button with optimistic UI, localStorage deduplication, and dark/light theme adaptation.

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useLike } from "@/hooks/useLike";
import { useStudioStore } from "@/lib/store";

interface LikeButtonProps {
  slug: string;
  count: number;
}

export function LikeButton({ slug, count }: LikeButtonProps) {
  const { liked, like } = useLike(slug);
  const theme = useStudioStore((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={like}
      disabled={liked}
      whileTap={!liked ? { scale: 0.88 } : {}}
      className={`group flex items-center gap-2 rounded-xl border px-3.5 py-1.5 transition-all duration-200 ${
        liked
          ? "border-purple-500/50 bg-purple-500/15 cursor-default shadow-[0_0_12px_rgba(168,85,247,0.2)]"
          : isDark
          ? "border-white/10 bg-white/5 hover:border-purple-400/40 hover:bg-purple-500/10"
          : "border-slate-200 bg-slate-100 hover:border-purple-400/50 hover:bg-purple-50"
      }`}
      aria-label={liked ? "Already liked" : "Like this project"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={liked ? "liked" : "not-liked"}
          initial={{ scale: 0.5, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.5 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <Heart
            size={15}
            className={
              liked
                ? "fill-purple-500 text-purple-500 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]"
                : isDark
                ? "text-white/40 group-hover:text-purple-400"
                : "text-slate-400 group-hover:text-purple-600"
            }
          />
        </motion.div>
      </AnimatePresence>

      <span
        className={`font-display text-xs font-semibold tabular-nums ${
          liked
            ? "text-purple-500"
            : isDark
            ? "text-white/60"
            : "text-slate-700"
        }`}
      >
        {count}
      </span>

      {!liked && (
        <span
          className={`text-[11px] transition-colors ${
            isDark ? "text-white/40 group-hover:text-white/70" : "text-slate-500 group-hover:text-slate-900"
          }`}
        >
          Like
        </span>
      )}
    </motion.button>
  );
}
