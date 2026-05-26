import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { buildProtocolSchema } from "./structured-data";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const BASE_URL = "https://rivus.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Rivus — On-Chain Payment Streaming on Stacks",
    template: "%s | Rivus",
  },
  description:
    "Open a stream and the recipient earns STX continuously — per block. Built for payroll, vesting, and subscriptions on Stacks with Bitcoin finality.",
  keywords: [
    "payment streaming",
    "Stacks",
    "STX",
    "Bitcoin",
    "smart contracts",
    "Clarity",
    "payroll",
    "vesting",
    "DeFi",
  ],
  authors: [{ name: "opepraise", url: "https://github.com/opepraise" }],
  creator: "opepraise",
  openGraph: {
    title: "Rivus — On-Chain Payment Streaming on Stacks",
    description: "On-chain payment streaming protocol on Stacks",
    type: "website",
    url: BASE_URL,
    siteName: "Rivus",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rivus — On-Chain Payment Streaming",
    description: "STX streams per block. No cron jobs. Bitcoin finality.",
    creator: "@opepraise",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "talentapp:project_verification":
      "afa161c86445028d195a2d900727f4bb39251c79dc0256f057a79d6849056d734db0c0056edf7a475a1f49c088b5e2375410c2f76355defe21dd133ead3f1e9b",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProtocolSchema()) }}
        />
      </head>
      <body className="min-h-screen bg-(--background) text-(--foreground) antialiased">
        {children}
      </body>
    </html>
  );
}
