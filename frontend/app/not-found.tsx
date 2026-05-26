import type { Metadata } from "next";
import { GitHubIcon } from "./components/icons";
import { GITHUB_URL } from "./data";

export const metadata: Metadata = {
  title: "Page not found — Rivus",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-6"
      aria-labelledby="not-found-heading"
    >
      <p className="font-mono text-6xl font-bold text-(--accent)/40 tabular-nums" aria-hidden="true">
        404
      </p>
      <h1 id="not-found-heading" className="text-2xl font-semibold text-white">
        Page not found
      </h1>
      <p className="text-(--text-muted) max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <a
          href="/"
          className="rounded-lg bg-(--accent) px-5 py-2.5 text-sm font-medium text-white hover:bg-(--accent-dark) transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Go home
        </a>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Rivus on GitHub (opens in new tab)"
          className="flex items-center gap-2 rounded-lg border border-(--border) px-5 py-2.5 text-sm font-medium text-(--foreground) hover:border-[#94a3b8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
        >
          <GitHubIcon />
          GitHub
        </a>
      </div>
    </main>
  );
}
