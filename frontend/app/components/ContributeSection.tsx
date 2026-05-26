import { GITHUB_URL } from "../data";

const ways = [
  {
    title: "Report bugs",
    desc: "Open an issue describing the unexpected behaviour and steps to reproduce.",
    href: `${GITHUB_URL}/issues/new`,
    cta: "Open issue",
  },
  {
    title: "Suggest features",
    desc: "Start a discussion in the GitHub Discussions tab before opening a PR.",
    href: `${GITHUB_URL}/discussions`,
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
        <p className="mt-2 text-[#94a3b8]">Rivus is community driven.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {ways.map((w) => (
          <div
            key={w.title}
            className="rounded-xl border border-[#1e293b] bg-[#0d1117] p-5 space-y-3 hover:border-[#6366f1]/30 transition-colors"
          >
            <h3 className="text-sm font-semibold text-white">{w.title}</h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">{w.desc}</p>
            <a
              href={w.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${w.cta} on GitHub (opens in new tab)`}
              className="inline-block text-xs text-[#818cf8] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] rounded"
            >
              {w.cta} →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
