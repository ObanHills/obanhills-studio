"use client";
// components/ui/HUD.tsx
// 3D Immersion HUD overlay with control hints, node counter, and exit button.

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Box } from "lucide-react";
import { useStudioStore } from "@/lib/store";

interface HUDProps {
  onExit3D?: () => void;
}

export function HUD({ onExit3D }: HUDProps) {
  const projects = useStudioStore((s) => s.projects);
  const [showHint, setShowHint] = useState(true);

  // Fade out the hint after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Bottom-left: Controls hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="pointer-events-none fixed bottom-6 left-6 z-30"
          >
            <p className="rounded-xl border border-white/[0.08] bg-[#07090e]/80 px-4 py-2.5 text-xs tracking-wider text-white/50 backdrop-blur-md shadow-2xl">
              🖱 <strong className="text-white/80">Drag</strong> to orbit &nbsp;·&nbsp; <strong className="text-white/80">Scroll</strong> to zoom &nbsp;·&nbsp;{" "}
              <span className="text-[#00e5a3] font-semibold">Click any node to explore</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom-right: Node count & Exit Button */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-3">
        {onExit3D && (
          <button
            onClick={onExit3D}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-[#07090e]/85 px-4 py-2.5 text-xs font-semibold text-white/80 backdrop-blur-md transition-all hover:border-white/30 hover:text-white shadow-xl"
          >
            <ArrowLeft size={13} />
            <span>Return to Overview</span>
          </button>
        )}

        {projects.length > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-[#00e5a3]/30 bg-[#07090e]/85 px-3.5 py-2.5 backdrop-blur-md shadow-xl">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#00e5a3] shadow-[0_0_8px_#00e5a3]" />
            <span className="font-display text-xs font-semibold tracking-wider text-white/70 uppercase">
              {projects.length} Nodes Active
            </span>
          </div>
        )}
      </div>
    </>
  );
}
