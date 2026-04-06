import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Claimly — Flight Delay Compensation Experts",
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
    <html lang="en" className={`${inter.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
