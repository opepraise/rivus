import { GitHubIcon } from "./icons";
import { Badge } from "./Badge";

const GITHUB_URL = "https://github.com/opepraise/rivus";
const CONTRACTS_URL = "https://github.com/opepraise/rivus/tree/main/contracts";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="space-y-6 pt-16">
      <Badge>
        <span className="h-1.5 w-1.5 rounded-full bg-[#6366f1]" aria-hidden="true" />
        Built on Stacks · Secured by Bitcoin
      </Badge>
      <h1
        id="hero-heading"
        className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-2xl"
      >
        <span className="text-white">Payment streaming,</span>
        <br />
        <span className="bg-linear-to-r from-[#6366f1] to-[#818cf8] bg-clip-text text-transparent">
          block by block
        </span>
      </h1>
      <p className="text-lg text-[#94a3b8] max-w-xl leading-relaxed">
        Open a stream and the recipient earns STX continuously — down to the block level.
        No cron jobs. No middlemen. All logic lives in Clarity smart contracts with Bitcoin finality.
      </p>
      <div className="flex gap-4 pt-2 flex-wrap" role="group" aria-label="Primary actions">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Rivus on GitHub (opens in new tab)"
          className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
        >
          <GitHubIcon className="text-black" />
          GitHub
        </a>
        <a
          href={CONTRACTS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View smart contracts on GitHub (opens in new tab)"
          className="flex items-center gap-2 rounded-lg border border-[#1e293b] px-5 py-2.5 text-sm font-medium text-[#e2e8f0] hover:border-[#94a3b8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
        >
          View Contracts
        </a>
      </div>
    </section>
  );
}
