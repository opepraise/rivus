interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <article
      className="rounded-xl border border-[#1e293b] bg-[#0d1117] p-5 space-y-1 hover:border-[#6366f1]/30 hover:scale-[1.02] transition-all duration-200"
      aria-label={`${label}: ${value}`}
    >
      <p className="text-xs text-[#94a3b8] uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-semibold text-white tabular-nums">{value}</p>
    </article>
  );
}
