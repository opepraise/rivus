import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rivus — On-Chain Payment Streaming on Stacks",
  description: "Open a stream, and the recipient earns STX continuously — per block. Built for payroll, vesting, and subscriptions on Stacks.",
  openGraph: {
    title: "Rivus",
    description: "On-chain payment streaming protocol on Stacks",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-[#080b0f] text-[#e2e8f0] antialiased">
        {children}
      </body>
    </html>
  );
}
