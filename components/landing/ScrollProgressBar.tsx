"use client";
// components/landing/ScrollProgressBar.tsx
// A thin progress bar pinned to the top of the viewport that fills as the user
// scrolls through the landing page — borrowed from scroll-world's sw-scrollbar pattern.
//
// Implemented with a passive scroll listener + rAF batching (same technique as
// scroll-world) so it never blocks the main thread. Respects prefers-reduced-motion
// by skipping the bar entirely.

import { useEffect, useRef } from "react";
import { useStudioStore } from "@/lib/store";

export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);
  const theme = useStudioStore((s) => s.theme);
  const isDark = theme === "dark";

  // Skip for users who prefer reduced motion
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reducedMotion) return;

    function update() {
      const bar = barRef.current;
      if (!bar) return;
      const scrollTop = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
      bar.style.transform = `scaleX(${progress})`;
      ticking.current = false;
    }

    function onScroll() {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    // Run once on mount to handle any initial scroll offset
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    /* Outer track — very subtle, matches page bg */
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[60] h-[2.5px]"
      style={{
        background: isDark
          ? "rgba(0, 229, 163, 0.1)"
          : "rgba(13, 148, 136, 0.1)",
      }}
    >
      {/* Fill bar — scales from 0→1 on the x-axis from the left */}
      <div
        ref={barRef}
        className="h-full w-full origin-left"
        style={{
          transform: "scaleX(0)",
          background: isDark
            ? "linear-gradient(90deg, #00e5a3, #38bdf8)"
            : "linear-gradient(90deg, #0d9488, #0ea5e9)",
          boxShadow: isDark
            ? "0 0 8px rgba(0, 229, 163, 0.6)"
            : "0 0 8px rgba(13, 148, 136, 0.5)",
        }}
      />
    </div>
  );
}
