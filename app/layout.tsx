// app/layout.tsx
// Root layout — loads fonts, sets metadata, applies dark mode class.

import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

// Display / headings — clean geometric, confident without being loud.
// More refined letterforms than Space Grotesk, less AI-template energy.
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

// Body / UI — neutral workhorse, gets out of the way of the design.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://obanhills.vercel.app"),
  title: {
    default: "ObanHills Studio — Building The Digital Peak",
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
    title: "ObanHills Studio — Building The Digital Peak",
    description:
      "Explore an interactive 3D portfolio by Obande Sunday Itodo. Brand identity, spatial web experiences, and AI-driven creative workflows.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ObanHills Studio — Building The Digital Peak",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ObanHills Studio — Building The Digital Peak",
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
      className={`dark ${outfit.variable} ${inter.variable}`}
    >
      <body className="bg-terrain-dark font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
