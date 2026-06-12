import { ISSUES_URL } from "../data";

export function AuditBanner() {
  return (
    <aside
      aria-label="Audit status notice"
      className="flex items-start gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-5 py-4"
    >
      <span className="text-yellow-400 text-base leading-none mt-0.5 shrink-0" aria-hidden="true">
        ⚠
      </span>
      <p className="text-sm text-yellow-200/80 leading-relaxed">
        <strong className="font-semibold text-yellow-300">Unaudited software.</strong>{" "}
        Rivus contracts are live on Stacks mainnet but have not yet undergone a formal
        third-party security audit. Use at your own risk and do not stream funds you
        cannot afford to lose.{" "}
        <a
          href={ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-yellow-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
          aria-label="Follow audit progress on GitHub (opens in new tab)"
        >
          Follow audit progress on GitHub.
        </a>
      </p>
    </aside>
  );
}
