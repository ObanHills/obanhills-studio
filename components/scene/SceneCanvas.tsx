"use client";
// components/scene/SceneCanvas.tsx
// Root R3F Canvas with calibrated lighting and crisp atmosphere for Dark and Light modes.

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, AdaptiveDpr } from "@react-three/drei";
import { Terrain } from "./Terrain";
import { ProjectNode } from "./ProjectNode";
import { CameraRig } from "./CameraRig";
import { PostProcessing } from "./PostProcessing";
import { useStudioStore } from "@/lib/store";

export default function SceneCanvas() {
  const projects = useStudioStore((s) => s.projects);
  const theme = useStudioStore((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 10, 18], fov: 55 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: isDark ? "#07090e" : "#ffffff" }}
    >
      {/* Adaptive DPR for performance */}
      <AdaptiveDpr pixelated />

      {/* Dynamic Theme Lighting */}
      {isDark ? (
        <>
          <ambientLight intensity={0.4} color="#0c1420" />
          <directionalLight
            position={[12, 22, 14]}
            intensity={0.9}
            color="#ffffff"
            castShadow
          />
          <pointLight position={[0, 10, 0]} intensity={1.5} color="#00e5a3" distance={25} />
          <pointLight position={[-10, 6, -10]} intensity={0.8} color="#38bdf8" distance={22} />
          <pointLight position={[10, 6, 10]} intensity={0.6} color="#94a3b8" distance={20} />
          <fog attach="fog" args={["#07090e", 18, 55]} />
          <Stars
            radius={80}
            depth={40}
            count={3000}
            factor={3}
            saturation={0.3}
            fade
            speed={0.4}
          />
        </>
      ) : (
        <>
          <ambientLight intensity={1.2} color="#ffffff" />
          <directionalLight
            position={[14, 25, 14]}
            intensity={1.6}
            color="#ffffff"
            castShadow
          />
          <pointLight position={[0, 12, 0]} intensity={0.9} color="#0d9488" distance={28} />
          <pointLight position={[-10, 6, -10]} intensity={0.5} color="#38bdf8" distance={22} />
          <fog attach="fog" args={["#ffffff", 22, 65]} />
        </>
      )}

      {/* Main scene content */}
      <Suspense fallback={null}>
        <Terrain />
        {projects.map((project) => (
          <ProjectNode key={project.slug} project={project} />
        ))}
      </Suspense>

      {/* Camera behaviour */}
      <CameraRig />

      {/* Post-processing effects */}
      <PostProcessing />
    </Canvas>
  );
}
