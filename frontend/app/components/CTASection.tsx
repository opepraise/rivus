import { GitHubIcon } from "./icons";

const GITHUB_URL = "https://github.com/opepraise/rivus";

export function CTASection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="rounded-xl border border-[#6366f1]/20 bg-gradient-to-br from-[#6366f1]/10 to-[#0d1117] p-10 text-center space-y-6"
    >
      <h2 id="cta-heading" className="text-2xl font-bold text-white">
        Ready to stream payments on-chain?
      </h2>
      <p className="text-[#94a3b8] max-w-md mx-auto">
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
          href={`${GITHUB_URL}/issues`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open an issue on GitHub (opens in new tab)"
          className="flex items-center gap-2 rounded-lg border border-[#1e293b] px-6 py-2.5 text-sm font-medium text-[#e2e8f0] hover:border-[#6366f1]/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
        >
          Open an Issue
        </a>
      </div>
    </section>
  );
}
