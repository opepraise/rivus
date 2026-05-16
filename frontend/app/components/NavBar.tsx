import { GitHubIcon } from "./icons";
import { LiveDot } from "./LiveDot";

const GITHUB_URL = "https://github.com/opepraise/rivus";

const navLinks = [
  { href: "#how-it-works-heading",  label: "How it works" },
  { href: "#use-cases-heading",     label: "Use cases" },
  { href: "#contracts-heading",     label: "Contracts" },
  { href: "#faq-heading",           label: "FAQ" },
];

export function NavBar() {
  return (
    <nav
      aria-label="Main navigation"
      className="flex items-center justify-between sticky top-0 z-10 bg-[#080b0f]/80 backdrop-blur-sm -mx-6 px-6 py-4 border-b border-[#1e293b]/60"
    >
      <a
        href="#main-content"
        className="text-lg font-semibold tracking-tight text-white flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] rounded"
      >
        <LiveDot />
        Rivus
      </a>
      <ul className="hidden sm:flex items-center gap-6" role="list">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-[#94a3b8] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] rounded"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Rivus on GitHub (opens in new tab)"
        className="flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] rounded"
      >
        <GitHubIcon />
        <span className="hidden sm:inline">View on GitHub</span>
      </a>
    </nav>
  );
}
