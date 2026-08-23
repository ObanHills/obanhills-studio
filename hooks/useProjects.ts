// hooks/useProjects.ts
// Fetches all projects from the API, assigns deterministic 3D positions and
// colors to each, then hydrates the Zustand store.

"use client";

import { useEffect } from "react";
import { useStudioStore } from "@/lib/store";
import type { Project } from "@/types";

// Cohesive luxury palette — elegant, unified studio tones
const NODE_COLORS = [
  "#00e5a3", // studio emerald teal
  "#00d2ff", // cyber ice cyan
  "#38bdf8", // subtle azure
  "#34d399", // mint emerald
  "#67e8f9", // crisp ice
];

/**
 * Assigns a deterministic (x, y, z) position on the terrain for each project.
 * Positions are spread in a rough circle around the center of the terrain.
 */
function assignPositions(projects: Project[]): Project[] {
  return projects.map((project, i) => {
    const total = projects.length;
    // Spread nodes evenly in a circle with some variance
    const angle = (i / total) * Math.PI * 2;
    const radius = 6 + (i % 3) * 1.5; // 6–9 units from center
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 1.2; // Slightly above terrain surface

    return {
      ...project,
      position: [x, y, z] as [number, number, number],
      color: NODE_COLORS[i % NODE_COLORS.length],
    };
  });
}

export function useProjects() {
  const { setProjects, setIsSceneReady } = useStudioStore();

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data: Project[] = await res.json();
        if (isMounted) {
          setProjects(assignPositions(data));
        }
      } catch (err) {
        console.error("[useProjects]", err);
      } finally {
        if (isMounted) {
          setIsSceneReady(true);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [setProjects, setIsSceneReady]);
}
