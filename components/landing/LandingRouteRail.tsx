"use client";
// components/landing/LandingRouteRail.tsx
// Fixed right-side dot navigation for the landing page sections — borrowed from
// scroll-world's sw-route pattern.
//
// Uses IntersectionObserver to track which section is in view (the one occupying
// the most screen real-estate becomes "active"). Each dot jump-scrolls to its
// section. Tooltip label appears on hover. Hidden on mobile (< 768px) and in 3D mode.
// Respects prefers-reduced-motion (instant scroll instead of smooth).

import { useEffect, useRef, useState } from "react";
import { useStudioStore } from "@/lib/store";

const SECTIONS = [
  { id: "hero",     label: "Home" },
  { id: "works",    label: "Selected Works" },
  { id: "services", label: "Services" },
  { id: "about",    label: "About" },
  { id: "contact",  label: "Contact" },
] as const;

interface LandingRouteRailProps {
  /** Hide the rail when in 3D immersion mode */
  is3DMode: boolean;
}

export function LandingRouteRail({ is3DMode }: LandingRouteRailProps) {
  const [activeId, setActiveId] = useState<string>("hero");
  const theme = useStudioStore((s) => s.theme);
  const isDark = theme === "dark";

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Track which section is currently most visible via IntersectionObserver
  useEffect(() => {
    if (is3DMode) return;

    // Map of sectionId → current intersection ratio
    const ratios: Record<string, number> = {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios[entry.target.id] = entry.intersectionRatio;
        });
        // The active section is whichever has the highest ratio
        const best = Object.entries(ratios).sort((a, b) => b[1] - a[1])[0];
        if (best && best[1] > 0) setActiveId(best[0]);
      },
      {
        // Fire at every 1% change so the active dot tracks smoothly
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        rootMargin: "0px",
      }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [is3DMode]);

  function jumpTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  }

  if (is3DMode) return null;

  return (
    <nav
      aria-label="Page sections"
      className="pointer-events-auto fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-5 md:flex"
      style={{ padding: "18px 10px" }}
    >
      {/* Vertical connector line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-5 bottom-5 w-px -translate-x-1/2"
        style={{
          background: isDark
            ? "rgba(0, 229, 163, 0.2)"
            : "rgba(13, 148, 136, 0.25)",
        }}
      />

      {SECTIONS.map(({ id, label }) => {
        const isActive = activeId === id;
        return (
          <button
            key={id}
            onClick={() => jumpTo(id)}
            aria-label={`Jump to ${label}`}
            aria-current={isActive ? "true" : undefined}
            className="group relative flex h-4 w-4 items-center justify-center"
            style={{ zIndex: 1 }}
          >
            {/* Dot */}
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: isActive ? "11px" : "8px",
                height: isActive ? "11px" : "8px",
                background: isActive
                  ? isDark ? "#00e5a3" : "#0d9488"
                  : isDark ? "rgba(0,229,163,0.3)" : "rgba(13,148,136,0.3)",
                boxShadow: isActive
                  ? isDark
                    ? "0 0 0 4px rgba(0,229,163,0.18)"
                    : "0 0 0 4px rgba(13,148,136,0.18)"
                  : "none",
              }}
            />

            {/* Tooltip label — appears to the left on hover */}
            <span
              className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
              style={{
                transform: "translateY(-50%) translateX(4px)",
                background: isDark
                  ? "rgba(7, 9, 14, 0.9)"
                  : "rgba(255,255,255,0.95)",
                border: isDark
                  ? "1px solid rgba(0,229,163,0.2)"
                  : "1px solid rgba(13,148,136,0.2)",
                color: isDark ? "#e2e8f0" : "#0f172a",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
