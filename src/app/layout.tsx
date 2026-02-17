import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthNav } from "@/components/layout/AuthNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GymTracker — AI-Powered Fitness",
  description: "Track your progress, analyze meals, and get AI workout plans",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <main className="max-w-lg mx-auto min-h-screen pb-nav">
          {children}
        </main>
        <AuthNav />
      </body>
    </html>
  );
}
