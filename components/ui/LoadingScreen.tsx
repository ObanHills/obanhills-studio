"use client";
// components/ui/LoadingScreen.tsx
// Full-screen animated loading overlay. Fades out once isSceneReady is true.

import { motion, AnimatePresence } from "framer-motion";
import { useStudioStore } from "@/lib/store";

export function LoadingScreen() {
  const isSceneReady = useStudioStore((s) => s.isSceneReady);

  return (
    <AnimatePresence>
      {!isSceneReady && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-terrain-dark"
        >
          {/* Logo wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h1 className="font-display text-4xl font-bold tracking-widest text-neon-teal drop-shadow-[0_0_20px_rgba(0,255,213,0.6)]">
              OBAN<span className="text-white">HILLS</span>
            </h1>
            <p className="mt-1.5 text-xs tracking-[0.4em] text-white/50 uppercase font-display font-medium">
              Uniquely Classic
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="h-px w-48 overflow-hidden rounded-full bg-white/10"
          >
            <motion.div
              className="h-full bg-neon-teal shadow-[0_0_8px_rgba(0,255,213,0.8)]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-xs tracking-widest text-white/20 uppercase"
          >
            Initialising terrain…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
