import type { Metadata } from "next";
import { Righteous } from "next/font/google";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";
import { satoshi, generalSans, cabinetGrotesk } from '@/fonts';

// Keep Righteous for the logo/brand
const righteous = Righteous({ 
    weight: "400",
    subsets: ["latin"],
    variable: "--font-righteous",
});

export const metadata: Metadata = {
  title: "PICTRIFY",
  description: "Your Imagination, PICTRIFIED.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${satoshi.variable} ${generalSans.variable} ${cabinetGrotesk.variable} ${righteous.variable} font-sans`}>
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
