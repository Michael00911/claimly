import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Claimly — Flight Delay Compensation",
  description:
    "Delayed flight in Europe? You could be owed up to €600. Claimly automatically files your compensation claim under EU Regulation EC261. No win, no fee.",
  keywords: [
    "flight delay compensation",
    "EC261",
    "airline compensation",
    "flight claim",
    "EU flight rights",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
