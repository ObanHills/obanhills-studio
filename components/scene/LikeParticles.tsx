"use client";
// components/scene/LikeParticles.tsx
// A lightweight 3D particle burst triggered when a project is liked.
// Particles fly upward and fade over ~1.5 seconds.

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Particle {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  opacity: number;
  scale: number;
}

interface LikeParticlesProps {
  color: string;
  triggered: boolean;
}

export function LikeParticles({ color, triggered }: LikeParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const prevTriggered = useRef(false);
  const idCounter = useRef(0);

  // Spawn burst when triggered flips to true
  useEffect(() => {
    if (triggered && !prevTriggered.current) {
      const burst: Particle[] = Array.from({ length: 12 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.04 + Math.random() * 0.06;
        return {
          id: idCounter.current++,
          position: new THREE.Vector3(
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.4
          ),
          velocity: new THREE.Vector3(
            Math.cos(angle) * speed * 0.6,
            0.04 + Math.random() * 0.07,
            Math.sin(angle) * speed * 0.6
          ),
          opacity: 1,
          scale: 0.04 + Math.random() * 0.06,
        };
      });
      setParticles(burst);
    }
    prevTriggered.current = triggered;
  }, [triggered]);

  // Animate particles each frame
  useFrame(() => {
    setParticles((prev) => {
      if (prev.length === 0) return prev;
      const updated = prev
        .map((p) => ({
          ...p,
          position: p.position.clone().add(p.velocity),
          velocity: new THREE.Vector3(
            p.velocity.x * 0.96,
            p.velocity.y - 0.002,
            p.velocity.z * 0.96
          ),
          opacity: p.opacity - 0.022,
          scale: p.scale * 0.97,
        }))
        .filter((p) => p.opacity > 0);
      return updated;
    });
  });

  if (particles.length === 0) return null;

  const parsedColor = new THREE.Color(color);

  return (
    <group>
      {particles.map((p) => (
        <mesh key={p.id} position={p.position} scale={p.scale}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial
            color={parsedColor}
            transparent
            opacity={p.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
