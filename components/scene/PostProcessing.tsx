"use client";
// components/scene/PostProcessing.tsx
// Applies bloom glow + vignette to the 3D canvas using @react-three/postprocessing.

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.45}
        luminanceSmoothing={0.8}
        intensity={0.7}
      />
      <Vignette
        eskil={false}
        offset={0.25}
        darkness={0.6}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
