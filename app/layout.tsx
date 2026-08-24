// app/layout.tsx
// Root layout — loads fonts, sets metadata, applies dark mode class.

import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://obanhills.vercel.app"),
  title: {
    default: "ObanHills Studio — Uniquely Classic",
    template: "%s | ObanHills Studio",
  },
  description:
    "ObanHills is a creative studio led by Obande Sunday Itodo — crafting bespoke brand identities, high-impact visual suites, interactive 3D web environments, and AI-powered design workflows.",
  keywords: [
    "ObanHills",
    "Obande Sunday Itodo",
    "Creative Studio",
    "Brand Identity",
    "3D Web Design",
    "Interactive Portfolio",
    "Three.js",
    "Visual Design",
    "Nigeria",
    "AI Design",
  ],
  authors: [{ name: "Obande Sunday Itodo", url: "https://obanhills.vercel.app" }],
  creator: "Obande Sunday Itodo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://obanhills.vercel.app",
    siteName: "ObanHills Studio",
    title: "ObanHills Studio — Uniquely Classic",
    description:
      "Explore an interactive 3D portfolio by Obande Sunday Itodo. Brand identity, spatial web experiences, and AI-driven creative workflows.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ObanHills Studio — Uniquely Classic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ObanHills Studio — Uniquely Classic",
    description:
      "Explore an interactive 3D portfolio by Obande Sunday Itodo. Brand identity, spatial web, and AI creative workflows.",
    images: ["/og-image.png"],
    creator: "@obanhills",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="bg-terrain-dark font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
