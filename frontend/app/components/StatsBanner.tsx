import { protocolStats } from "../data/stats";

interface StatsBannerProps {
  totalStreams?: number;
}

export function StatsBanner({ totalStreams }: StatsBannerProps) {
  const stats = protocolStats.map((s) =>
    s.live ? { ...s, value: totalStreams != null ? String(totalStreams) : "—" } : s
  );

  return (
    <section aria-labelledby="stats-heading" className="space-y-6">
      <h2 id="stats-heading" className="sr-only">Protocol statistics</h2>
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-(--border) bg-(--surface) px-5 py-5 space-y-1"
          >
            <dt className="text-xs text-(--text-muted) uppercase tracking-wide flex items-center gap-1.5">
              {stat.label}
              {stat.live && (
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" title="Live on-chain data" />
              )}
            </dt>
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
