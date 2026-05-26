import { GitHubIcon } from "./icons";
import { Badge } from "./Badge";
import { GITHUB_URL, CONTRACTS_URL } from "../data";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="space-y-6 pt-16">
      <Badge>
        <span className="h-1.5 w-1.5 rounded-full bg-(--accent)" aria-hidden="true" />
        Built on Stacks · Secured by Bitcoin
      </Badge>
      <h1
        id="hero-heading"
        className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-2xl"
      >
        Payment streaming,
        <br />
        block by block
      </h1>
      <p className="text-lg text-(--text-muted) max-w-xl leading-relaxed">
        Open a stream and the recipient earns STX continuously — down to the block level.
        No cron jobs. No middlemen. All logic lives in Clarity smart contracts with Bitcoin finality.
      </p>
      <div className="flex gap-4 pt-2 flex-wrap" role="group" aria-label="Primary actions">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Rivus on GitHub (opens in new tab)"
          className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
        >
          <GitHubIcon className="text-black" />
          GitHub
        </a>
        <a
          href={CONTRACTS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Browse smart contracts on GitHub (opens in new tab)"
          className="flex items-center gap-2 rounded-lg border border-(--border) px-5 py-2.5 text-sm font-medium text-(--foreground) hover:border-[#94a3b8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
        >
          View Contracts
        </a>
      </div>
    </section>
  );
}
