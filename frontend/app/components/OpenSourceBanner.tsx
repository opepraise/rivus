const GITHUB_URL = "https://github.com/opepraise/rivus";
const LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`;

export function OpenSourceBanner() {
  return (
    <aside
      aria-label="Open source license information"
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-[#1e293b] bg-[#0d1117] px-6 py-5"
    >
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold text-white">Open source · MIT License</p>
        <p className="text-sm text-[#94a3b8]">
          Use, fork, and modify freely. Contributions are welcome.
        </p>
      </div>
      <a
        href={LICENSE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Read MIT License on GitHub (opens in new tab)"
        className="text-xs text-[#818cf8] border border-[#6366f1]/30 rounded-full px-3 py-1 hover:bg-[#6366f1]/10 transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
      >
        View License
      </a>
    </aside>
  );
}
