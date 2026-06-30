import { GitHubIcon } from "./icons";
import { LiveDot } from "./LiveDot";
import { GITHUB_URL, navLinks } from "../data";

export function NavBar() {
  return (
    <nav
      aria-label="Main navigation"
      className="flex items-center justify-between sticky top-0 z-10 bg-(--background)/80 backdrop-blur-sm -mx-6 px-6 py-4 border-b border-(--border)/60"
    >
      <a
        href="#main-content"
        className="text-lg font-semibold tracking-tight text-white flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) rounded"
      >
        <LiveDot />
        Rivus
      </a>
      <ul className="hidden md:flex items-center gap-6" role="list">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-(--text-muted) hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) rounded"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Rivus on GitHub (opens in new tab)"
          className="hidden sm:flex items-center gap-2 text-sm text-(--text-muted) hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) rounded"
        >
          <GitHubIcon />
          <span className="hidden lg:inline">GitHub</span>
        </a>
        <a
          href="/dashboard"
          className="rounded-lg bg-(--accent) px-4 py-2 text-sm font-medium text-white hover:bg-[#4f46e5] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Launch App
        </a>
      </div>
    </nav>
  );
}
