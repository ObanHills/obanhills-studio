"use client";
// components/landing/Navbar.tsx
// Luxury top navigation bar with brand mark, section anchor links, 3D Immersion Mode toggle,
// and Sun/Moon theme switcher.

import { useState, useEffect } from "react";
import { Sparkles, Box, Lock, Menu, X, Sun, Moon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useStudioStore } from "@/lib/store";

interface NavbarProps {
  is3DMode: boolean;
  onToggle3D: () => void;
}

export function Navbar({ is3DMode, onToggle3D }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useStudioStore();
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || is3DMode
          ? isDark
            ? "bg-[#07090e]/85 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            : "bg-white/85 backdrop-blur-xl border-b border-slate-200/80 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Image
            src={isDark ? "/logo.png" : "/logo-dark.png"}
            alt="ObanHills Studio"
            width={200}
            height={64}
            className="h-14 w-auto object-contain transition-opacity group-hover:opacity-80"
            priority
          />
        </Link>

        {/* Center Nav Links (Desktop) */}
        {!is3DMode && (
          <nav
            className={`hidden md:flex items-center gap-8 text-xs font-medium transition-colors ${
              isDark ? "text-white/60" : "text-slate-600"
            }`}
          >
            <a
              href="#works"
              className={isDark ? "hover:text-white" : "hover:text-slate-950"}
            >
              Selected Works
            </a>
            <a
              href="#services"
              className={isDark ? "hover:text-white" : "hover:text-slate-950"}
            >
              Services & Capabilities
            </a>
            <a
              href="#about"
              className={isDark ? "hover:text-white" : "hover:text-slate-950"}
            >
              About
            </a>
            <a
              href="#contact"
              className={isDark ? "hover:text-white" : "hover:text-slate-950"}
            >
              Contact
            </a>
          </nav>
        )}

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
              isDark
                ? "border-white/10 bg-white/[0.04] text-amber-300 hover:border-amber-400/40 hover:bg-amber-400/10"
                : "border-slate-300 bg-slate-100 text-slate-700 hover:border-slate-400 hover:bg-slate-200"
            }`}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Toggle 3D Immersion Mode */}
          <button
            onClick={onToggle3D}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
              is3DMode
                ? "border-[#00e5a3] bg-[#00e5a3] text-black shadow-[0_0_20px_rgba(0,229,163,0.4)]"
                : isDark
                ? "border-[#00e5a3]/40 bg-[#00e5a3]/15 text-[#00e5a3] hover:bg-[#00e5a3]/25 shadow-[0_0_14px_rgba(0,229,163,0.15)]"
                : "border-[#00e5a3]/60 bg-[#00e5a3]/20 text-[#008f66] hover:bg-[#00e5a3]/30"
            }`}
          >
            <Box size={14} className={is3DMode ? "animate-spin" : ""} />
            <span>{is3DMode ? "Exit 3D View" : "Enter 3D World"}</span>
          </button>

          {/* Admin Link */}
          <a
            href="/admin"
            className={`hidden sm:flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer pointer-events-auto transition-all ${
              isDark
                ? "border-white/[0.12] bg-white/[0.05] text-white/70 hover:border-white/30 hover:bg-white/[0.1] hover:text-white"
                : "border-slate-300 bg-slate-100 text-slate-700 hover:border-slate-400 hover:bg-slate-200 hover:text-slate-950"
            }`}
          >
            <Lock size={12} />
            <span>Admin</span>
          </a>

          {/* Mobile Hamburger */}
          {!is3DMode && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 md:hidden ${
                isDark ? "text-white/60 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && !is3DMode && (
        <div
          className={`md:hidden border-b px-6 py-5 flex flex-col gap-4 text-sm font-medium backdrop-blur-2xl ${
            isDark
              ? "border-white/[0.08] bg-[#07090e]/95 text-white/70"
              : "border-slate-200 bg-white/95 text-slate-700"
          }`}
        >
          <a
            href="#works"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 hover:text-[#00e5a3]"
          >
            Selected Works
          </a>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 hover:text-[#00e5a3]"
          >
            Services & Capabilities
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 hover:text-[#00e5a3]"
          >
            About
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 hover:text-[#00e5a3]"
          >
            Contact
          </a>
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <a
              href="/admin"
              className={`text-xs flex items-center gap-1.5 font-semibold ${
                isDark ? "text-white/60 hover:text-white" : "text-slate-700 hover:text-slate-950"
              }`}
            >
              <Lock size={12} /> Studio Admin
            </a>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-xs text-[#00e5a3] font-semibold"
            >
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
              <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
