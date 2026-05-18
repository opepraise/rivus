import { GITHUB_URL } from "../data";

export function OpenSourceBanner() {
  return (
    <aside
      aria-label="Open source notice"
      className="flex items-center justify-between gap-4 rounded-xl border border-[#1e293b] bg-[#0d1117] px-6 py-4"
    >
      <p className="text-sm text-[#94a3b8]">
        Rivus is free and open source software released under the{" "}
        <strong className="font-medium text-white">MIT License</strong>.
      </p>
      <a
        href={`${GITHUB_URL}/blob/main/LICENSE`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View the MIT license on GitHub (opens in new tab)"
        className="shrink-0 text-xs text-[#818cf8] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] rounded"
      >
        View license →
      </a>
    </aside>
  );
}
