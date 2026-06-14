import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import CelestialBackground from "@/components/layout/CelestialBackground";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Aria Shadow | Artist Portfolio & CMS",
  description: "Discover the premium digital art, website projects, 3D models, and visual design archives of Aria Shadow.",
};

// ── CRITICAL: viewport meta tag — without this mobile browsers render at
//    ~980px desktop width and all responsive breakpoints are incorrect ──
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // maximumScale prevents iOS auto-zoom on input focus (improves UX)
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-background text-foreground antialiased selection:bg-cyan-500/30 selection:text-white`}>
        <ThemeProvider>
          <CelestialBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
