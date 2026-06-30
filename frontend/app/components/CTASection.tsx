import { GitHubIcon } from "./icons";
import { GITHUB_URL } from "../data";

export function CTASection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="rounded-xl border border-[#6366f1]/20 bg-linear-to-br from-(--accent)/10 to-(--surface) p-10 text-center space-y-6"
    >
      <h2 id="cta-heading" className="text-2xl font-bold text-white">
        Ready to stream payments on-chain?
      </h2>
      <p className="text-(--text-muted) max-w-md mx-auto">
        Connect your Stacks wallet and open a payment stream in seconds. No signups.
        No servers. Just you, your wallet, and Bitcoin-secured smart contracts.
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <a
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg bg-[#6366f1] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#4f46e5] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Launch App
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Star Rivus on GitHub (opens in new tab)"
          className="flex items-center gap-2 rounded-lg border border-(--border) px-6 py-2.5 text-sm font-medium text-(--foreground) hover:border-[#6366f1]/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
        >
          <GitHubIcon />
          Star on GitHub
        </a>
      </div>
    </section>
  );
}
