const GITHUB_URL = "https://github.com/opepraise/rivus";

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#1e293b] pt-10 pb-4 text-sm text-[#94a3b8]"
    >
      <span>Rivus — open source, MIT license</span>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Rivus source code on GitHub (opens in new tab)"
        className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] rounded"
      >
        github.com/opepraise/rivus
      </a>
    </footer>
  );
}
