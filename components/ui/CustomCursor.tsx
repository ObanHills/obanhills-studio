"use client";
// components/ui/CustomCursor.tsx
// A custom glowing cursor that expands when hovering over interactive 3D nodes.
// Designed for desktop use to enhance tactile feel.

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStudioStore } from "@/lib/store";

export function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isDesktop, setIsDesktop] = useState(false);
  const isHoveringNode = useStudioStore((s) => s.isHoveringNode);
  const theme = useStudioStore((s) => s.theme);

  useEffect(() => {
    // Only enable custom cursor on non-touch devices
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    };
    checkDesktop();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (isDesktop) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  const isDark = theme === "dark";

  return (
    <>
      {/* Center Point */}
      <motion.div
        className={`pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-difference ${
          isDark ? "bg-white" : "bg-black"
        }`}
        animate={{
          x: mousePos.x,
          y: mousePos.y,
          opacity: isHoveringNode ? 0 : 1,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />

      {/* Expanding Ring */}
      <motion.div
        className={`pointer-events-none fixed left-0 top-0 z-[99] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00e5a3] shadow-[0_0_12px_rgba(0,229,163,0.5)] ${
          isDark ? "mix-blend-screen" : "mix-blend-normal"
        }`}
        animate={{
          x: mousePos.x,
          y: mousePos.y,
          width: isHoveringNode ? 48 : 20,
          height: isHoveringNode ? 48 : 20,
          opacity: isHoveringNode ? 0.8 : 0.3,
          borderWidth: isHoveringNode ? "2px" : "1.5px",
        }}
        transition={{
          x: { type: "spring", stiffness: 400, damping: 28, mass: 0.5 },
          y: { type: "spring", stiffness: 400, damping: 28, mass: 0.5 },
          width: { type: "spring", stiffness: 300, damping: 20 },
          height: { type: "spring", stiffness: 300, damping: 20 },
          opacity: { duration: 0.2 },
        }}
      />
    </>
  );
}
