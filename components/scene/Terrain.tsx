"use client";
// components/scene/Terrain.tsx
// Procedural heightmap wireframe terrain with subtle theme-calibrated materials.

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import { useStudioStore } from "@/lib/store";

const noise2D = createNoise2D();

const SEGMENTS = 100;
const SIZE = 30;
const NOISE_SCALE = 0.18;
const MAX_HEIGHT = 2.0;

export function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const theme = useStudioStore((s) => s.theme);
  const isDark = theme === "dark";

  // Build the geometry with noise-displaced vertices
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    geo.rotateX(-Math.PI / 2); // Lay flat

    const positions = geo.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const noise = noise2D(x * NOISE_SCALE, z * NOISE_SCALE);
      // Map noise [-1,1] → [0, MAX_HEIGHT], but keep edges at 0 for clean boundary
      const distFromCenter = Math.sqrt(x * x + z * z) / (SIZE * 0.5);
      const edgeFade = Math.max(0, 1 - distFromCenter * 1.1);
      positions.setY(i, noise * MAX_HEIGHT * edgeFade);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  // Slow breathing animation
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      const t = clock.getElapsedTime() * 0.05;
      mat.wireframeLinewidth = 1;
      mat.emissiveIntensity = (isDark ? 0.14 : 0.06) + Math.sin(t * 2) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow>
      <meshStandardMaterial
        color={isDark ? "#04121a" : "#94a3b8"}
        emissive={isDark ? "#00e5a3" : "#0f766e"}
        emissiveIntensity={isDark ? 0.14 : 0.08}
        wireframe
        transparent
        opacity={isDark ? 0.6 : 0.35}
      />
    </mesh>
  );
}
