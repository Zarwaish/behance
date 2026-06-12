import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import CelestialBackground from "@/components/layout/CelestialBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Aria Shadow | Artist Portfolio & CMS",
  description: "Discover the premium digital art, website projects, 3D models, and visual design archives of Aria Shadow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-background text-foreground antialiased selection:bg-cyan-500/30 selection:text-white`}>
        <CelestialBackground />
        {children}
      </body>
    </html>
  );
}

