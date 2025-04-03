import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Righteous } from "next/font/google";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";

const inter = Inter({ subsets: ["latin"] });
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
      <body className={`${inter.className} ${righteous.variable}`}>
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
