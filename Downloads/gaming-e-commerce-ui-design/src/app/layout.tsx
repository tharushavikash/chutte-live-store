import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CHUTTE LIVE Diamond Store — Cheap Free Fire Diamonds Sri Lanka",
  description:
    "Buy Free Fire diamonds at Sri Lanka's cheapest price with instant automated delivery to your UID. EzCash, PayHere, Visa, Mastercard & Bank Transfer accepted. 100% safe & secure.",
  keywords: [
    "free fire topup sri lanka",
    "ff diamonds sri lanka",
    "cheapest ff diamonds",
    "instant ff topup",
    "ezcash topup",
    "payhere free fire",
    "chutte live",
  ],
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-LK" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="bg-canvas text-ink antialiased">{children}</body>
    </html>
  );
}
