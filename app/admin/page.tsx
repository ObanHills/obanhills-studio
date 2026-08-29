"use client";
// app/admin/page.tsx
// Luxury Executive Studio Admin Dashboard for ObanHills Creative Studio.

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ArrowLeft,
  RefreshCw,
  LayoutGrid,
  LogOut,
  Sparkles,
  Heart,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { ProjectList } from "@/components/admin/ProjectList";
import { ProjectForm } from "@/components/admin/ProjectForm";
import type { Project } from "@/types";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Check stored session
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_pw");
    if (saved) {
      setAdminPassword(saved);
      setIsAuthenticated(true);
    }
  }, []);

  const fetchProjects = useCallback(async (pw: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects", {
        headers: { "x-admin-password": pw },
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem("admin_pw");
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (err) {
      console.error("[Admin fetchProjects]", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && adminPassword) {
      fetchProjects(adminPassword);
    }
  }, [isAuthenticated, adminPassword, fetchProjects]);

  const handleLoginSuccess = () => {
    const saved = sessionStorage.getItem("admin_pw") || "";
    setAdminPassword(saved);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_pw");
    setIsAuthenticated(false);
    setAdminPassword("");
  };

  const handleSaved = (savedProject: Project) => {
    setIsCreating(false);
    setEditingProject(null);
    setProjects((prev) => {
      const exists = prev.some(
        (p) => p.id === savedProject.id || p.slug === savedProject.slug
      );
      if (exists) {
        return prev.map((p) => (p.id === savedProject.id ? savedProject : p));
      }
      return [savedProject, ...prev];
    });
    fetchProjects(adminPassword);
  };

  const handleDeleted = (slug: string) => {
    setProjects((prev) => prev.filter((p) => p.slug !== slug));
  };

  // Metrics computation
  const stats = useMemo(() => {
    const totalLikes = projects.reduce((acc, p) => acc + (p.likes_count || 0), 0);
    const totalMedia = projects.reduce(
      (acc, p) =>
        acc +
        (p.cover_image_url ? 1 : 0) +
        ((p.gallery_images && Array.isArray(p.gallery_images))
          ? p.gallery_images.length
          : 0),
      0
    );
    const categoryCount = new Set(projects.map((p) => p.category).filter(Boolean)).size;

    return {
      totalProjects: projects.length,
      totalLikes,
      totalMedia,
      categoryCount,
    };
  }, [projects]);

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="relative min-h-screen bg-[#07090e] text-white p-6 md:p-12 pb-36 overflow-y-auto">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-[#00e5a3]/5 blur-[140px]" />
      <div className="pointer-events-none fixed -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full bg-[#00d2ff]/5 blur-[140px]" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-8">
        {/* Navigation & Brand Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-b border-white/[0.08] pb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-white/70 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft size={14} /> Back to 3D Scene
            </Link>

            <div className="flex flex-col gap-0.5">
              <Image
                src="/logo.png"
                alt="ObanHills Studio"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
                priority
              />
              <span className="text-xs text-white/40">
                Digital Terrain Executive Manager
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchProjects(adminPassword)}
              disabled={loading}
              title="Refresh projects"
              className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            >
              <RefreshCw size={13} className={loading ? "animate-spin text-[#00e5a3]" : ""} />
              <span>Sync</span>
            </button>

            <button
              onClick={handleLogout}
              title="Logout"
              className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-medium text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/20"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Executive Metrics Overview */}
        {!isCreating && !editingProject && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0d1219]/70 p-4 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between text-white/40 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Total Nodes
                </span>
                <LayoutGrid size={15} className="text-[#00e5a3]" />
              </div>
              <div className="font-display text-2xl font-bold text-white">
                {stats.totalProjects}
              </div>
              <span className="text-[10px] text-white/30">Active in 3D scene</span>
            </div>

            {/* Metric 2 */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0d1219]/70 p-4 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between text-white/40 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Total Likes
                </span>
                <Heart size={15} className="text-purple-400" />
              </div>
              <div className="font-display text-2xl font-bold text-white">
                {stats.totalLikes}
              </div>
              <span className="text-[10px] text-white/30">Visitor appreciation</span>
            </div>

            {/* Metric 3 */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0d1219]/70 p-4 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between text-white/40 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Media Assets
                </span>
                <ImageIcon size={15} className="text-cyan-400" />
              </div>
              <div className="font-display text-2xl font-bold text-white">
                {stats.totalMedia}
              </div>
              <span className="text-[10px] text-white/30">Photos & covers</span>
            </div>

            {/* Metric 4 */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0d1219]/70 p-4 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between text-white/40 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Categories
                </span>
                <Layers size={15} className="text-[#00e5a3]" />
              </div>
              <div className="font-display text-2xl font-bold text-white">
                {stats.categoryCount}
              </div>
              <span className="text-[10px] text-white/30">Creative disciplines</span>
            </div>
          </div>
        )}

        {/* Section Header with Add New Project Button */}
        {!isCreating && !editingProject && (
          <div className="flex items-center justify-between pt-2">
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                Portfolio Showcase Works
              </h2>
              <p className="text-xs text-white/40">
                Manage artworks, flyers, live links & interactive nodes
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 rounded-xl border border-[#00e5a3]/40 bg-[#00e5a3]/20 px-5 py-2.5 text-xs font-semibold text-[#00e5a3] shadow-[0_0_20px_rgba(0,229,163,0.18)] transition-all hover:bg-[#00e5a3]/30"
            >
              <Plus size={15} /> Add New Project
            </motion.button>
          </div>
        )}

        {/* Main Content: Form vs List */}
        <main>
          <AnimatePresence mode="wait">
            {isCreating ? (
              <ProjectForm
                key="create-form"
                adminPassword={adminPassword}
                onSave={handleSaved}
                onCancel={() => setIsCreating(false)}
              />
            ) : editingProject ? (
              <ProjectForm
                key={`edit-${editingProject.slug}`}
                project={editingProject}
                adminPassword={adminPassword}
                onSave={handleSaved}
                onCancel={() => setEditingProject(null)}
              />
            ) : (
              <ProjectList
                key="list"
                projects={projects}
                adminPassword={adminPassword}
                onEdit={(proj) => setEditingProject(proj)}
                onDeleted={handleDeleted}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
