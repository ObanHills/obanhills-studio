"use client";
// components/scene/CameraRig.tsx
// Manages camera behaviour:
//  - OrbitControls for user-driven pan/zoom/rotate
//  - Auto-rotate when no project is selected
//  - Smooth lerp toward the active node when one is selected

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useStudioStore } from "@/lib/store";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 10, 18);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const { activeProjectSlug, projects } = useStudioStore();

  // Set initial camera position
  useEffect(() => {
    camera.position.copy(DEFAULT_CAMERA_POSITION);
    camera.lookAt(DEFAULT_TARGET);
  }, [camera]);

  useFrame(() => {
    if (!controlsRef.current) return;

    const activeProject = activeProjectSlug
      ? projects.find((p) => p.slug === activeProjectSlug)
      : null;

    if (activeProject?.position) {
      // Lerp camera toward node — position slightly above and behind
      const [nx, ny, nz] = activeProject.position;
      const targetCamPos = new THREE.Vector3(nx + 3, ny + 5, nz + 8);
      const targetLookAt = new THREE.Vector3(nx, ny, nz);

      camera.position.lerp(targetCamPos, 0.04);
      controlsRef.current.target.lerp(targetLookAt, 0.04);
    } else {
      // Drift back to default when no node selected
      camera.position.lerp(DEFAULT_CAMERA_POSITION, 0.02);
      controlsRef.current.target.lerp(DEFAULT_TARGET, 0.02);
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      autoRotate={!activeProjectSlug}
      autoRotateSpeed={0.35}
      minPolarAngle={Math.PI * 0.1}
      maxPolarAngle={Math.PI * 0.48}
      minDistance={5}
      maxDistance={35}
    />
  );
}
