"use client";
// app/page.tsx
// Home page — Scroll-Driven Hybrid Portfolio uniting an interactive 3D terrain canvas
// with a luxury marketing landing page and 3D immersion mode toggle.

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useProjects } from "@/hooks/useProjects";
import { useStudioStore } from "@/lib/store";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { HUD } from "@/components/ui/HUD";
import { ProjectPanel } from "@/components/ui/ProjectPanel";

// Landing Page Components
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturedWorksSection } from "@/components/landing/FeaturedWorksSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { ScrollProgressBar } from "@/components/landing/ScrollProgressBar";
import { LandingRouteRail } from "@/components/landing/LandingRouteRail";

// Dynamically import the 3D canvas (no SSR)
const SceneCanvas = dynamic(
  () => import("@/components/scene/SceneCanvas"),
  { ssr: false }
);

export default function HomePage() {
  const [is3DMode, setIs3DMode] = useState(false);
  const setActiveProject = useStudioStore((s) => s.setActiveProject);

  // Deep linking: read from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectParam = urlParams.get("project");
    if (projectParam) {
      setActiveProject(projectParam);
    }
  }, [setActiveProject]);

  // Hydrate projects data into Zustand
  useProjects();
  const projects = useStudioStore((s) => s.projects);
  const theme = useStudioStore((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <main
      className={`relative min-h-screen w-full transition-colors duration-300 ${
        isDark
          ? "bg-[#07090e] text-white selection:bg-[#00e5a3]/30 selection:text-[#00e5a3]"
          : "bg-[#faf9f7] text-slate-900 selection:bg-[#00e5a3]/30 selection:text-[#008f66]"
      }`}
    >
      {/* Scroll progress bar — pinned above everything, hidden in 3D mode */}
      {!is3DMode && <ScrollProgressBar />}

      {/* 3D Background Canvas */}
      <div
        className={`fixed inset-0 transition-opacity duration-700 ${
          is3DMode
            ? "z-20 pointer-events-auto opacity-100"
            : isDark
            ? "z-[1] pointer-events-none opacity-40 md:opacity-50"
            : "z-[1] pointer-events-none opacity-80 md:opacity-100"
        }`}
      >
        <SceneCanvas />
      </div>

      {/* Global Navbar */}
      <Navbar
        is3DMode={is3DMode}
        onToggle3D={() => setIs3DMode(!is3DMode)}
      />

      {/* 3D Immersion HUD (Active when in 3D Mode) */}
      {is3DMode && (
        <div className="relative z-30 pointer-events-auto">
          <HUD onExit3D={() => setIs3DMode(false)} />
        </div>
      )}

      {/* Scrollable Landing Page (Active when not in 3D Mode) */}
      {!is3DMode && (
        <div className="relative z-10 flex flex-col">
          {/* Hero — id="hero" for IntersectionObserver in LandingRouteRail */}
          <section id="hero">
            <HeroSection
              projects={projects}
              onExplore3D={() => setIs3DMode(true)}
            />
          </section>

          {/* Selected Works — id="works" lives on the inner <section> inside FeaturedWorksSection */}
          <FeaturedWorksSection projects={projects} />

          {/* Services & Capabilities */}
          <ServicesSection />

          {/* About the Founder */}
          <AboutSection />

          {/* Contact Inquiry */}
          <ContactSection />

          {/* Footer */}
          <Footer />
        </div>
      )}

      {/* Route rail dot nav — right-side section navigator, desktop only */}
      <LandingRouteRail is3DMode={is3DMode} />

      {/* Common UI Overlays */}
      <LoadingScreen />
      <ProjectPanel />
    </main>
  );
}
