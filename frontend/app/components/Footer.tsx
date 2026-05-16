import { GitHubIcon } from "./icons";

const GITHUB_URL = "https://github.com/opepraise/rivus";
const currentYear = new Date().getFullYear();

const footerLinks = [
  { href: `${GITHUB_URL}/blob/main/LICENSE`, label: "License" },
  { href: `${GITHUB_URL}/issues`,            label: "Issues" },
  { href: `${GITHUB_URL}/discussions`,       label: "Discussions" },
  { href: `${GITHUB_URL}/releases`,          label: "Releases" },
];

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="space-y-6 border-t border-[#1e293b] pt-10 pb-4 text-sm text-[#94a3b8]"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#6366f1]" aria-hidden="true" />
          <span className="font-semibold text-white">Rivus</span>
          <span className="text-[#1e293b]">·</span>
          <span>MIT License</span>
        </div>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Rivus source code on GitHub (opens in new tab)"
          className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] rounded"
        >
          <GitHubIcon />
          github.com/opepraise/rivus
        </a>
      </div>
      <nav aria-label="Footer links" className="flex flex-wrap gap-x-6 gap-y-2">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.label} on GitHub (opens in new tab)`}
            className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] rounded"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <p className="text-xs text-[#475569]">
        &copy; {currentYear} Rivus. Open source software.
      </p>
    </footer>
  );
}
