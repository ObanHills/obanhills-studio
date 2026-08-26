"use client";
// components/scene/LikeParticles.tsx
// A lightweight 3D particle burst triggered when a project is liked.
// Particles fly upward and fade over ~1.5 seconds.
//
// Refactored from per-frame setState (which caused React re-renders at 60fps)
// to a fully imperative ref-based approach: mesh refs are mutated directly in
// useFrame, eliminating all React reconciliation during the particle lifetime.
// Skipped entirely when prefers-reduced-motion is set.

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 12;

interface ParticleState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  opacity: number;
  scale: number;
  alive: boolean;
}

interface LikeParticlesProps {
  color: string;
  triggered: boolean;
}

export function LikeParticles({ color, triggered }: LikeParticlesProps) {
  // Respect prefers-reduced-motion — skip entirely
  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // Stable mesh refs — one per particle slot, always mounted
  const meshRefs = useRef<(THREE.Mesh | null)[]>(
    Array.from({ length: PARTICLE_COUNT }, () => null)
  );

  // Per-particle simulation state in a plain ref (no React state)
  const particleStates = useRef<ParticleState[]>(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      opacity: 0,
      scale: 0,
      alive: false,
    }))
  );

  const prevTriggered = useRef(false);
  const parsedColor = useMemo(() => new THREE.Color(color), [color]);

  // Reusable vectors to avoid per-frame allocations
  const _vel = useRef(new THREE.Vector3());

  // Spawn burst when triggered flips to true
  useEffect(() => {
    if (reducedMotion.current) return;
    if (triggered && !prevTriggered.current) {
      particleStates.current.forEach((p) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.04 + Math.random() * 0.06;
        p.position.set(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.4
        );
        p.velocity.set(
          Math.cos(angle) * speed * 0.6,
          0.04 + Math.random() * 0.07,
          Math.sin(angle) * speed * 0.6
        );
        p.opacity = 1;
        p.scale = 0.04 + Math.random() * 0.06;
        p.alive = true;
      });
    }
    prevTriggered.current = triggered;
  }, [triggered]);

  // Animate particles imperatively — zero React re-renders per frame
  useFrame((_state, delta) => {
    if (reducedMotion.current) return;

    // Guard against large delta spikes (tab out, slow device) — cap at ~3 frames
    const dt = Math.min(delta, 0.05);
    const dtFactor = dt / 0.01667; // normalise against 60fps baseline

    particleStates.current.forEach((p, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      if (!p.alive) {
        mesh.visible = false;
        return;
      }

      // Physics step
      _vel.current.copy(p.velocity);
      p.position.addScaledVector(_vel.current, dtFactor);
      p.velocity.x *= Math.pow(0.96, dtFactor);
      p.velocity.y -= 0.002 * dtFactor;
      p.velocity.z *= Math.pow(0.96, dtFactor);
      p.opacity -= 0.022 * dtFactor;
      p.scale *= Math.pow(0.97, dtFactor);

      if (p.opacity <= 0) {
        p.alive = false;
        mesh.visible = false;
        return;
      }

      // Imperatively update the mesh — no setState, no reconciliation
      mesh.visible = true;
      mesh.position.copy(p.position);
      mesh.scale.setScalar(p.scale);
      (mesh.material as THREE.MeshBasicMaterial).opacity = p.opacity;
      (mesh.material as THREE.MeshBasicMaterial).color.copy(parsedColor);
    });
  });

  if (reducedMotion.current) return null;

  // Always render the fixed pool of meshes; visibility is toggled imperatively
  return (
    <group>
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          visible={false}
        >
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial
            color={parsedColor}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
