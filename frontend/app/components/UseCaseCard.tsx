interface UseCaseCardProps {
  icon: string;
  title: string;
  desc: string;
}

export function UseCaseCard({ icon, title, desc }: UseCaseCardProps) {
  return (
    <article className="group rounded-xl border border-[#1e293b] bg-[#0d1117] p-6 space-y-3 hover:border-[#6366f1]/30 hover:bg-[#6366f1]/5 transition-all duration-200">
      <span
        className="font-mono text-3xl font-bold text-[#6366f1]/50 tabular-nums group-hover:text-[#6366f1]/80 transition-colors"
        aria-hidden="true"
      >
        {icon}
      </span>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-sm text-[#94a3b8] leading-relaxed">{desc}</p>
    </article>
  );
}
