import { GITHUB_URL } from "../data";

export function OpenSourceBanner() {
  return (
    <aside
      aria-label="Open source notice"
      className="flex items-center justify-between gap-4 rounded-xl border border-(--border) bg-(--surface) px-6 py-4"
    >
      <p className="text-sm text-(--text-muted)">
        Rivus is free and open source software released under the{" "}
        <strong className="font-medium text-white">MIT License</strong>.
      </p>
      <a
        href={`${GITHUB_URL}/blob/main/LICENSE`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View the MIT license on GitHub (opens in new tab)"
        className="shrink-0 text-xs text-(--accent-muted) hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) rounded"
      >
        View license →
      </a>
    </aside>
  );
}
