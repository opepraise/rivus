import { GitHubIcon } from "./icons";
import { GITHUB_URL, SDK_NPM_URL } from "../data";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-(--border) pt-10 pb-4 text-sm text-(--text-muted)"
    >
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-(--accent)" aria-hidden="true" />
        <span className="font-semibold text-white">Rivus</span>
        <span aria-hidden="true" className="text-[#1e293b]">·</span>
        <span>MIT License · &copy; {currentYear}</span>
      </div>
      <div className="flex items-center gap-4">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Rivus source code on GitHub (opens in new tab)"
          className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) rounded"
        >
          <GitHubIcon />
          GitHub
        </a>
        <a
          href={SDK_NPM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View rivus-sdk on npm (opens in new tab)"
          className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) rounded"
        >
          npm
        </a>
      </div>
    </footer>
  );
}
