interface UseCaseCardProps {
  icon: string;
  title: string;
  desc: string;
}

export function UseCaseCard({ icon, title, desc }: UseCaseCardProps) {
  return (
    <article className="group rounded-xl border border-(--border) bg-(--surface) p-6 space-y-3 hover:border-(--accent)/30 hover:bg-(--accent)/5 transition-all duration-200">
      <span
        className="font-mono text-3xl font-bold text-(--accent)/50 tabular-nums group-hover:text-(--accent)/80 transition-colors"
        aria-hidden="true"
      >
        {icon}
      </span>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-sm text-(--text-muted) leading-relaxed">{desc}</p>
    </article>
  );
}
