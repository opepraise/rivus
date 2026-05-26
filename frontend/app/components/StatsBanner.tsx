import { protocolStats } from "../data/stats";

export function StatsBanner() {
  return (
    <section aria-labelledby="stats-heading" className="space-y-6">
      <h2 id="stats-heading" className="sr-only">Protocol statistics</h2>
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {protocolStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-(--border) bg-(--surface) px-5 py-5 space-y-1"
          >
            <dt className="text-xs text-(--text-muted) uppercase tracking-wide">{stat.label}</dt>
            <dd
              className="text-2xl font-bold text-white"
              aria-label={`${stat.label}: ${stat.value}`}
            >
              {stat.value}
            </dd>
            <p className="text-xs text-[#64748b] leading-relaxed">{stat.desc}</p>
          </div>
        ))}
      </dl>
    </section>
  );
}
