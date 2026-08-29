"use client";
// components/landing/Footer.tsx
// Studio footer with brand mark, credits, and theme adaptation.

import { ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useStudioStore } from "@/lib/store";

export function Footer() {
  const theme = useStudioStore((s) => s.theme);
  const isDark = theme === "dark";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className={`border-t py-12 px-6 md:px-12 transition-colors ${
        isDark ? "border-white/[0.08] bg-[#07090e]/90" : "border-slate-200 bg-white/90"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Brand */}
        <Link href="/" className="flex items-center group">
          <Image
            src={isDark ? "/logo.png" : "/logo-dark.png"}
            alt="ObanHills Studio"
            width={120}
            height={40}
            className="h-8 w-auto object-contain transition-opacity group-hover:opacity-70"
          />
        </Link>

        {/* Center Credits */}
        <div
          className={`text-center text-xs ${
            isDark ? "text-white/40" : "text-slate-500"
          }`}
        >
          <span>Designed & Engineered by </span>
          <strong className={isDark ? "text-white/80 font-medium" : "text-slate-900 font-semibold"}>
            Obande Sunday Itodo
          </strong>
          <span> © {new Date().getFullYear()} ObanHills</span>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-4">
          <a
            href="/admin"
            className={`text-xs font-medium transition-colors ${
              isDark ? "text-white/60 hover:text-white" : "text-slate-600 hover:text-slate-950"
            }`}
          >
            Studio Admin
          </a>
          <button
            onClick={scrollToTop}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
              isDark
                ? "border-white/[0.08] bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white"
                : "border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300 hover:text-slate-950"
            }`}
            title="Back to top"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
