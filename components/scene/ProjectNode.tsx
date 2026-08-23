"use client";
// components/scene/ProjectNode.tsx
// Refined, luxury 3D project node with grounded hologram beacon, dark glass framed artwork,
// smooth tilt physics, subtle polished hover lift, and minimalist typography.

import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, Sphere, Torus, Cylinder, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useStudioStore } from "@/lib/store";
import type { Project } from "@/types";

interface ProjectNodeProps {
  project: Project;
}

export function ProjectNode({ project }: ProjectNodeProps) {
  const { position, color = "#00e5a3", title, cover_image_url, category } = project;
  const groupRef = useRef<THREE.Group>(null);
  const cardGroupRef = useRef<THREE.Group>(null);
  const baseRingRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { setActiveProject, activeProjectSlug } = useStudioStore();
  const isActive = activeProjectSlug === project.slug;
  const { camera } = useThree();

  // Load texture cleanly
  const texture = useMemo(() => {
    if (!cover_image_url) return null;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    const tex = loader.load(cover_image_url);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }, [cover_image_url]);

  // Dynamic animation and hover interaction
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const seed = (position?.[0] ?? 0) * 1.5;

    // Smooth floating bob with gentle elevation on hover
    const baseY = position ? position[1] : 1.4;
    const hoverLift = hovered || isActive ? 0.35 : 0;
    const targetY = baseY + hoverLift + Math.sin(t * 1.2 + seed) * 0.08;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08);

    // Tasteful, refined hover scale (1.18x)
    const targetScale = hovered || isActive ? 1.18 : 1.0;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    // Card orientation: faces camera gently with smooth damping
    if (cardGroupRef.current) {
      if (hovered || isActive) {
        // Look directly toward camera with subtle responsiveness
        const camPos = camera.position;
        const groupPos = groupRef.current.position;
        const targetAngle = Math.atan2(camPos.x - groupPos.x, camPos.z - groupPos.z);
        cardGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          cardGroupRef.current.rotation.y,
          targetAngle,
          0.08
        );
        cardGroupRef.current.rotation.x = THREE.MathUtils.lerp(cardGroupRef.current.rotation.x, 0.05, 0.08);
      } else {
        // Slow organic idle rotation
        cardGroupRef.current.rotation.y = Math.sin(t * 0.4 + seed) * 0.25;
        cardGroupRef.current.rotation.x = Math.sin(t * 0.3 + seed) * 0.04;
      }
    }

    // Ground beacon & base ring pulse
    if (baseRingRef.current && beaconRef.current) {
      const pulse = 0.5 + Math.sin(t * 2 + seed) * 0.2;
      const baseMat = baseRingRef.current.material as THREE.MeshBasicMaterial;
      const beaconMat = beaconRef.current.material as THREE.MeshBasicMaterial;
      baseMat.opacity = hovered || isActive ? 0.8 : pulse * 0.5;
      beaconMat.opacity = hovered || isActive ? 0.35 : pulse * 0.15;
    }
  });

  if (!position) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* Grounding Light Pillar / Beacon reaching down to terrain */}
      <Cylinder
        ref={beaconRef}
        args={[0.04, 0.15, 1.6, 16]}
        position={[0, -0.8, 0]}
      >
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Cylinder>

      {/* Ground Base Ring */}
      <mesh
        ref={baseRingRef}
        position={[0, -1.6, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.3, 0.38, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main Interactive 3D Node Object */}
      <group
        ref={cardGroupRef}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          setActiveProject(project.slug);
        }}
      >
        {texture ? (
          /* Sleek Obsidian Glass Card with Framed Artwork */
          <group>
            {/* Dark Glass Backing Plate with subtle rim glow */}
            <RoundedBox args={[1.3, 1.7, 0.06]} radius={0.06} smoothness={4}>
              <meshStandardMaterial
                color="#06090e"
                roughness={0.15}
                metalness={0.9}
                emissive={color}
                emissiveIntensity={hovered || isActive ? 0.35 : 0.1}
              />
            </RoundedBox>

            {/* Artwork Image Plane (Crisp, proportional, tone mapped) */}
            <mesh position={[0, 0, 0.035]}>
              <planeGeometry args={[1.18, 1.58]} />
              <meshBasicMaterial map={texture} toneMapped={false} />
            </mesh>

            {/* Glowing Accent Border Ring */}
            <Torus
              position={[0, 0, -0.04]}
              args={[0.95, 0.012, 16, 64]}
            >
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={hovered || isActive ? 0.9 : 0.4}
                transparent
                opacity={0.6}
              />
            </Torus>
          </group>
        ) : (
          /* Minimalist Geometric Obsidian Prism with Core Glow */
          <group>
            <Sphere args={[0.38, 32, 32]}>
              <meshStandardMaterial
                color="#090d14"
                roughness={0.1}
                metalness={0.95}
                emissive={color}
                emissiveIntensity={hovered || isActive ? 0.8 : 0.35}
              />
            </Sphere>

            <Torus args={[0.55, 0.012, 16, 64]}>
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={hovered || isActive ? 0.9 : 0.4}
                transparent
                opacity={0.6}
              />
            </Torus>
          </group>
        )}
      </group>

      {/* Refined Minimalist Hover Tooltip Pill */}
      {(hovered || isActive) && (
        <Html
          center
          position={[0, 1.25, 0]}
          style={{ pointerEvents: "none" }}
          distanceFactor={9}
        >
          <div
            style={{
              background: "rgba(8, 12, 18, 0.88)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderTop: `2px solid ${color}`,
              borderRadius: "8px",
              padding: "7px 14px",
              color: "#ffffff",
              backdropFilter: "blur(12px)",
              boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 16px ${color}25`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              whiteSpace: "nowrap",
              animation: "fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: color,
              }}
            >
              {category || "Project"}
            </span>
            <span
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: "#ffffff",
                letterSpacing: "0.02em",
              }}
            >
              {title}
            </span>
            <span
              style={{
                fontSize: "9px",
                color: "rgba(255, 255, 255, 0.4)",
                marginTop: "2px",
              }}
            >
              Click to view details
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}
