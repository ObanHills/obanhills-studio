"use client";
// components/ui/CustomCursor.tsx
// A custom glowing cursor that expands when hovering over interactive 3D nodes.
// Zero-lag implementation using MotionValues.

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useStudioStore } from "@/lib/store";

export function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const isHoveringNode = useStudioStore((s) => s.isHoveringNode);
  const theme = useStudioStore((s) => s.theme);

  // MotionValues bypass React state for 0 latency
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Add a very tight spring to the outer ring for a smooth trailing effect
  const springConfig = { damping: 30, stiffness: 700, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    };
    checkDesktop();

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    if (isDesktop) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDesktop, cursorX, cursorY]);

  if (!isDesktop) return null;

  const isDark = theme === "dark";

  return (
    <>
      {/* Center Point - 100% Instant mapping (no spring) */}
      <motion.div
        className={`pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-difference ${
          isDark ? "bg-white" : "bg-black"
        }`}
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          opacity: isHoveringNode ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Expanding Ring - Smooth trailing mapping */}
      <motion.div
        className={`pointer-events-none fixed left-0 top-0 z-[99] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00e5a3] shadow-[0_0_12px_rgba(0,229,163,0.5)] ${
          isDark ? "mix-blend-screen" : "mix-blend-normal"
        }`}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          width: isHoveringNode ? 48 : 20,
          height: isHoveringNode ? 48 : 20,
          opacity: isHoveringNode ? 0.8 : 0.4,
          borderWidth: isHoveringNode ? "2px" : "1.5px",
        }}
        transition={{
          width: { type: "spring", stiffness: 400, damping: 25 },
          height: { type: "spring", stiffness: 400, damping: 25 },
          opacity: { duration: 0.2 },
        }}
      />
    </>
  );
}
