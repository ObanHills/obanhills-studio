"use client";
// components/scene/SceneCanvas.tsx
// Root R3F Canvas with calibrated lighting for Dark and Light modes.
// Automatically reduces quality on mobile for smooth performance.

import { Suspense, useEffect, useState } from "react";
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

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || !window.matchMedia("(hover: hover)").matches);
  }, []);

  const bgColor = isDark ? "#07090e" : "#faf9f7";

  return (
    <Canvas
      shadows={!isMobile}
      dpr={isMobile ? [1, 1.2] : [1, 2]}
      camera={{ position: [0, 10, 18], fov: isMobile ? 65 : 55 }}
      gl={{ antialias: !isMobile, alpha: false }}
      style={{ background: bgColor }}
    >
      <AdaptiveDpr pixelated />

      <color attach="background" args={[bgColor]} />

      {isDark ? (
        <>
          <ambientLight intensity={0.4} color="#0c1420" />
          <directionalLight
            position={[12, 22, 14]}
            intensity={0.9}
            color="#ffffff"
            castShadow={!isMobile}
          />
          <pointLight position={[0, 10, 0]} intensity={1.5} color="#00e5a3" distance={25} />
          <pointLight position={[-10, 6, -10]} intensity={0.8} color="#38bdf8" distance={22} />
          {!isMobile && (
            <pointLight position={[10, 6, 10]} intensity={0.6} color="#94a3b8" distance={20} />
          )}
          <fog attach="fog" args={["#07090e", 18, 55]} />
          {!isMobile && (
            <Stars radius={80} depth={40} count={2000} factor={3} saturation={0.3} fade speed={0.4} />
          )}
        </>
      ) : (
        <>
          <ambientLight intensity={1.2} color="#ffffff" />
          <directionalLight
            position={[14, 25, 14]}
            intensity={1.6}
            color="#fff8f0"
            castShadow={!isMobile}
          />
          <pointLight position={[0, 12, 0]} intensity={0.9} color="#0d9488" distance={28} />
          {!isMobile && (
            <pointLight position={[-10, 6, -10]} intensity={0.5} color="#38bdf8" distance={22} />
          )}
          <fog attach="fog" args={["#faf9f7", 22, 65]} />
        </>
      )}

      <Suspense fallback={null}>
        <Terrain isMobile={isMobile} />
        {projects.map((project) => (
          <ProjectNode key={project.slug} project={project} />
        ))}
      </Suspense>

      <CameraRig />

      {!isMobile && <PostProcessing />}
    </Canvas>
  );
}
