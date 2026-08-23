// app/layout.tsx
// Root layout — loads fonts, sets metadata, applies dark mode class.

import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { CustomCursor } from "@/components/ui/CustomCursor";
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
  title: "ObanHills Interactive Studio",
  description:
    "An interactive 3D portfolio by Obande Sunday Itodo — explore projects across a digital terrain.",
  openGraph: {
    title: "ObanHills Interactive Studio",
    description: "Explore projects across a 3D digital terrain.",
    type: "website",
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
      <body className="bg-terrain-dark font-sans antialiased [&:has(.custom-cursor)]:cursor-none">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
