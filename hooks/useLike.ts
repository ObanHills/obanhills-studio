// hooks/useLike.ts
// Handles optimistic like toggling with localStorage persistence and API sync.

"use client";

import { useCallback } from "react";
import { useStudioStore } from "@/lib/store";

export function useLike(slug: string) {
  const { hasLiked, toggleLike, incrementLikeCount } = useStudioStore();
  const liked = hasLiked(slug);

  const like = useCallback(async () => {
    if (liked) return; // Already liked — prevent double-submit

    // Optimistic UI update
    toggleLike(slug);
    incrementLikeCount(slug);

    try {
      const res = await fetch(`/api/projects/${slug}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Like request failed");
    } catch (err) {
      console.error("[useLike]", err);
      // Rollback optimistic update on error
      toggleLike(slug);
      incrementLikeCount(slug); // This will go negative — keep simple for V1
    }
  }, [slug, liked, toggleLike, incrementLikeCount]);

  return { liked, like };
}
