"use client";
// components/ui/LoadingScreen.tsx
// Branded full-screen loading overlay for the 3D terrain.
// Turns the technical delay into an intentional moment — shows the ObanHills
// mark, an animated terrain-line motif, and a progress bar.
// Fades out once isSceneReady is set to true in the store.

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useStudioStore } from "@/lib/store";

// Fake progress that advances quickly to ~85% then waits for the real ready signal
function useSimulatedProgress(ready: boolean) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (ready) {
      setProgress(100);
      return;
    }
    // Fast ramp to 82%, then slow crawl — creates a sense of loading activity
    const intervals: ReturnType<typeof setTimeout>[] = [];
    const steps = [
      { target: 35, delay: 120, step: 3 },
      { target: 62, delay: 80, step: 2 },
      { target: 82, delay: 120, step: 1 },
    ];
    let current = 0;
    steps.forEach(({ target, delay, step }) => {
      const run = () => {
        setProgress((p) => {
          if (p >= target) return p;
          const next = Math.min(p + step, target);
          if (next < target) intervals.push(setTimeout(run, delay));
          return next;
        });
      };
      intervals.push(setTimeout(run, current));
      current += (target / step) * delay;
    });
    return () => intervals.forEach(clearTimeout);
  }, [ready]);

  return progress;
}

// Minimal SVG terrain lines — mirrors the actual 3D wireframe aesthetic
function TerrainLines() {
  return (
    <svg
      viewBox="0 0 320 60"
      fill="none"
      className="w-64 opacity-20"
      aria-hidden="true"
    >
      {[
        "M0 45 Q40 30 80 38 Q120 46 160 28 Q200 10 240 22 Q280 34 320 18",
        "M0 55 Q40 42 80 50 Q120 58 160 40 Q200 22 240 34 Q280 46 320 30",
        "M0 35 Q40 18 80 26 Q120 34 160 16 Q200 -2 240 10 Q280 22 320 6",
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="#00e5a3"
          strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4 + i * 0.3, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

export function LoadingScreen() {
  const isSceneReady = useStudioStore((s) => s.isSceneReady);
  const progress = useSimulatedProgress(isSceneReady);

  const statusLabel =
    progress < 40 ? "Initialising terrain…" :
    progress < 70 ? "Placing project nodes…" :
    progress < 90 ? "Calibrating atmosphere…" :
    "Almost ready…";

  return (
    <AnimatePresence>
      {!isSceneReady && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#07090e" }}
        >
          {/* Subtle radial glow behind the mark */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(0,229,163,0.07) 0%, transparent 70%)",
            }}
          />

          {/* Terrain lines motif */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 opacity-60">
            <TerrainLines />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Brand mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-4"
            >
              {/* Logo */}
              <Image
                src="/logo.png"
                alt="ObanHills Studio"
                width={180}
                height={64}
                className="h-16 w-auto object-contain"
                priority
              />
              <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase font-sans">
                The Digital Peak
              </p>
            </motion.div>

            {/* Progress bar + label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-3 w-56"
            >
              {/* Track */}
              <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/[0.07]">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #00e5a3, #38bdf8)",
                    boxShadow: "0 0 8px rgba(0,229,163,0.7)",
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.4 }}
                />
              </div>

              {/* Status text */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={statusLabel}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="text-[10px] tracking-[0.18em] text-white/30 uppercase font-sans text-center"
                >
                  {statusLabel}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
