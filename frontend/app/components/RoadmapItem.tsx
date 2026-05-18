import type { RoadmapStatus } from "../data/roadmap";

interface RoadmapItemProps {
  title: string;
  desc: string;
  status: RoadmapStatus;
}

const statusConfig: Record<RoadmapStatus, { label: string; className: string }> = {
  done:        { label: "Done",        className: "text-green-400 border-green-500/30 bg-green-500/10" },
  "in-progress": { label: "In progress", className: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" },
  planned:     { label: "Planned",     className: "text-[#818cf8] border-[#6366f1]/30 bg-[#6366f1]/10" },
};

export function RoadmapItem({ title, desc, status }: RoadmapItemProps) {
  const { label, className } = statusConfig[status];
  return (
    <article className="flex items-start gap-4 px-6 py-5 border-b border-[#1e293b] last:border-b-0">
      <div className="flex-1 space-y-1">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-sm text-[#94a3b8] leading-relaxed">{desc}</p>
      </div>
      <span
        className={`shrink-0 rounded px-2 py-0.5 text-xs border ${className}`}
        aria-label={`Status: ${label}`}
      >
        {label}
      </span>
    </article>
  );
}
