// lib/store.ts
// Global Zustand store for the ObanHills Interactive Studio portfolio.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project } from "@/types";

interface StudioState {
  // ── Scene Data ──────────────────────────────────────────────────────────────
  projects: Project[];
  setProjects: (projects: Project[]) => void;

  // ── UI State ─────────────────────────────────────────────────────────────────
  activeProjectSlug: string | null;
  isPanelOpen: boolean;
  isSceneReady: boolean;
  isHoveringNode: boolean;

  setActiveProject: (slug: string | null) => void;
  setIsPanelOpen: (open: boolean) => void;
  setIsSceneReady: (ready: boolean) => void;
  setIsHoveringNode: (hovering: boolean) => void;

  // ── Theme State (persisted) ───────────────────────────────────────────────
  theme: "dark" | "light";
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;

  // ── Likes (persisted to localStorage) ───────────────────────────────────────
  likedSlugs: string[];
  toggleLike: (slug: string) => void;
  hasLiked: (slug: string) => boolean;

  // ── Optimistic like count ───────────────────────────────────────────────────
  incrementLikeCount: (slug: string) => void;
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      // Scene Data
      projects: [],
      setProjects: (projects) => set({ projects }),

      // UI State
      activeProjectSlug: null,
      isPanelOpen: false,
      isSceneReady: false,
      isHoveringNode: false,

      setActiveProject: (slug) => {
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          if (slug) {
            url.searchParams.set("project", slug);
          } else {
            url.searchParams.delete("project");
          }
          window.history.pushState({}, "", url.toString());
        }
        set({ activeProjectSlug: slug, isPanelOpen: slug !== null });
      },

      setIsPanelOpen: (open) => set({ isPanelOpen: open }),

      setIsSceneReady: (ready) => set({ isSceneReady: ready }),

      setIsHoveringNode: (hovering) => set({ isHoveringNode: hovering }),

      // Theme
      theme: "dark",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
      setTheme: (theme) => set({ theme }),

      // Likes
      likedSlugs: [],
      toggleLike: (slug) => {
        const current = get().likedSlugs;
        const has = current.includes(slug);
        set({ likedSlugs: has ? current.filter((s) => s !== slug) : [...current, slug] });
      },
      hasLiked: (slug) => get().likedSlugs.includes(slug),

      // Optimistic like count update
      incrementLikeCount: (slug) => {
        const projects = get().projects.map((p) =>
          p.slug === slug ? { ...p, likes_count: p.likes_count + 1 } : p
        );
        set({ projects });
      },
    }),
    {
      name: "obanhills-studio",
      // Persist theme and liked slugs to localStorage
      partialize: (state) => ({
        likedSlugs: state.likedSlugs,
        theme: state.theme,
      }),
    }
  )
);
