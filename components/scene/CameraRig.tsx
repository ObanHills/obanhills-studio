"use client";
// components/scene/CameraRig.tsx
// Manages camera behaviour:
//  - OrbitControls for user-driven pan/zoom/rotate
//  - Auto-rotate when no project is selected
//  - Smooth linger-eased lerp toward the active node when one is selected
//
// Improvements from scroll-world:
//  - linger easing: camera settles smoothly as it arrives at a node instead
//    of asymptotically crawling (organic "breath" at the destination)
//  - pre-allocated THREE.Vector3 reuse — zero heap allocations inside useFrame
//  - frame-delta guard: skips the lerp step when delta spikes (tab-out, slow
//    device) to prevent animation debt and camera jumps
//  - prefers-reduced-motion: skips all lerp animation; camera snaps instantly

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useStudioStore } from "@/lib/store";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 10, 18);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

// Maximum delta we'll act on (~3 dropped frames at 60fps). Larger spikes
// (tab switch, slow device stall) are clamped so the camera doesn't jump.
const MAX_DELTA = 0.05;

/**
 * linger easing — borrowed from scroll-world's scrub engine.
 * Remaps a 0→1 progress value so the camera settles naturally mid-journey:
 * it moves quickly at the start, eases into the destination (L=0 is linear,
 * L=1 is a full mid-point pause). Keep L ≤ 0.6 for natural feel.
 *
 *   f(0) = 0, f(1) = 1 always — endpoints are never displaced.
 */
function lingerEase(x: number, L: number): number {
  const xc = Math.min(1, Math.max(0, x));
  const Lc = Math.min(1, Math.max(0, L));
  const c = xc - 0.5;
  return (1 - Lc) * xc + Lc * (4 * c * c * c + 0.5);
}

// Linger strength for node arrival animation (0 = linear, ~0.45 = organic ease)
const LINGER = 0.45;

export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const { activeProjectSlug, projects } = useStudioStore();

  // prefers-reduced-motion — captured once at mount, stable
  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // Pre-allocated vectors — reused every frame, zero GC pressure
  const _targetCamPos = useRef(new THREE.Vector3());
  const _targetLookAt = useRef(new THREE.Vector3());

  // Track normalised arrival progress 0→1 for linger easing
  const arrivalProgress = useRef(0);
  const prevActiveSlug = useRef<string | null>(null);

  // Set initial camera position
  useEffect(() => {
    camera.position.copy(DEFAULT_CAMERA_POSITION);
    camera.lookAt(DEFAULT_TARGET);
  }, [camera]);

  useFrame((_state, delta) => {
    if (!controlsRef.current) return;

    // Guard: ignore frames that took too long (prevents jump after tab switch)
    if (delta > MAX_DELTA) return;

    const activeProject = activeProjectSlug
      ? projects.find((p) => p.slug === activeProjectSlug)
      : null;

    // Reset progress counter when selection changes
    if (activeProjectSlug !== prevActiveSlug.current) {
      arrivalProgress.current = 0;
      prevActiveSlug.current = activeProjectSlug;
    }

    if (activeProject?.position) {
      const [nx, ny, nz] = activeProject.position;
      _targetCamPos.current.set(nx + 3, ny + 5, nz + 8);
      _targetLookAt.current.set(nx, ny, nz);

      if (reducedMotion.current) {
        // Snap immediately — no animation
        camera.position.copy(_targetCamPos.current);
        controlsRef.current.target.copy(_targetLookAt.current);
      } else {
        // Advance progress and apply linger easing to the lerp alpha
        arrivalProgress.current = Math.min(1, arrivalProgress.current + delta * 0.55);
        const easedAlpha = lingerEase(arrivalProgress.current, LINGER);
        // Map eased progress back to a per-frame lerp factor
        const lerpAlpha = Math.min(0.12, easedAlpha * 0.12);

        camera.position.lerp(_targetCamPos.current, lerpAlpha);
        controlsRef.current.target.lerp(_targetLookAt.current, lerpAlpha);
      }
    } else {
      // Drift back to default — no linger needed on the return drift
      if (reducedMotion.current) {
        camera.position.copy(DEFAULT_CAMERA_POSITION);
        controlsRef.current.target.copy(DEFAULT_TARGET);
      } else {
        camera.position.lerp(DEFAULT_CAMERA_POSITION, 0.02);
        controlsRef.current.target.lerp(DEFAULT_TARGET, 0.02);
      }
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
