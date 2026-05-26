import { GITHUB_URL, ISSUES_URL, DISCUSSIONS_URL } from "../data";

const ways = [
  {
    title: "Report bugs",
    desc: "Open an issue describing the unexpected behaviour and steps to reproduce.",
    href: `${ISSUES_URL}/new`,
    cta: "Open issue",
  },
  {
    title: "Suggest features",
    desc: "Start a discussion in the GitHub Discussions tab before opening a PR.",
    href: DISCUSSIONS_URL,
    cta: "Start discussion",
  },
  {
    title: "Submit a PR",
    desc: "Fork the repo, make your changes, and open a pull request against main.",
    href: `${GITHUB_URL}/fork`,
    cta: "Fork repo",
  },
];

export function ContributeSection() {
  return (
    <section aria-labelledby="contribute-heading" className="space-y-6">
      <div>
        <h2 id="contribute-heading" className="text-2xl font-semibold text-white">
          Contribute
        </h2>
        <p className="mt-2 text-(--text-muted)">Rivus is community driven.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {ways.map((w) => (
          <div
            key={w.title}
            className="rounded-xl border border-(--border) bg-(--surface) p-5 space-y-3 hover:border-[#6366f1]/30 transition-colors"
          >
            <h3 className="text-sm font-semibold text-white">{w.title}</h3>
            <p className="text-sm text-(--text-muted) leading-relaxed">{w.desc}</p>
            <a
              href={w.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${w.cta} on GitHub (opens in new tab)`}
              className="inline-block text-xs text-(--accent-muted) hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) rounded"
            >
              {w.cta} →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
