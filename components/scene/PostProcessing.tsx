"use client";
// components/scene/PostProcessing.tsx
// Applies bloom glow + vignette to the 3D canvas using @react-three/postprocessing.

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useStudioStore } from "@/lib/store";

export function PostProcessing() {
  const theme = useStudioStore((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={isDark ? 0.45 : 0.8}
        luminanceSmoothing={0.8}
        intensity={isDark ? 0.7 : 0.2}
      />
      {isDark && (
        <Vignette
          eskil={false}
          offset={0.25}
          darkness={0.6}
          blendFunction={BlendFunction.NORMAL}
        />
      )}
    </EffectComposer>
  );
}
