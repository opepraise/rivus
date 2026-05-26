"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-6"
      aria-labelledby="error-heading"
    >
      <p className="font-mono text-6xl font-bold text-[var(--accent)]/40 tabular-nums" aria-hidden="true">
        500
      </p>
      <h1 id="error-heading" className="text-2xl font-semibold text-white">
        Something went wrong
      </h1>
      <p className="text-[var(--text-muted)] max-w-sm">
        An unexpected error occurred. Try refreshing the page or come back later.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] hover:border-[var(--text-muted)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          Go home
        </a>
      </div>
    </main>
  );
}
