import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rivus — On-Chain Payment Streaming on Stacks",
  description: "Open a stream and the recipient earns STX continuously — per block. Built for payroll, vesting, and subscriptions on Stacks.",
  openGraph: {
    title: "Rivus",
    description: "On-chain payment streaming protocol on Stacks",
    type: "website",
  },
  other: {
    "talentapp:project_verification":
      "afa161c86445028d195a2d900727f4bb39251c79dc0256f057a79d6849056d734db0c0056edf7a475a1f49c088b5e2375410c2f76355defe21dd133ead3f1e9b",
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
