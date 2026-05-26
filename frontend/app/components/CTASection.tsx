import { GitHubIcon } from "./icons";
import { GITHUB_URL, SDK_NPM_URL } from "../data";

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
        Rivus is open source and MIT licensed. Clone the repo, run the tests, and start
        building payment streams on Stacks today.
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Star Rivus on GitHub (opens in new tab)"
          className="flex items-center gap-2 rounded-lg bg-[#6366f1] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#4f46e5] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <GitHubIcon />
          Star on GitHub
        </a>
        <a
          href={SDK_NPM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Install rivus-sdk from npm (opens in new tab)"
          className="flex items-center gap-2 rounded-lg border border-(--border) px-6 py-2.5 text-sm font-medium text-(--foreground) hover:border-[#6366f1]/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
        >
          Install SDK
        </a>
      </div>
    </section>
  );
}
