interface LifecycleRowProps {
  step: string;
  actor: string;
  desc: string;
  isLast?: boolean;
}

const actorColors: Record<string, string> = {
  sender:    "text-[#6366f1] bg-[#6366f1]/10 border-[#6366f1]/20",
  recipient: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

export function LifecycleRow({ step, actor, desc, isLast = false }: LifecycleRowProps) {
  const colorClass = actorColors[actor] ?? actorColors.sender;
  return (
    <div
      role="row"
      className={`flex items-start gap-4 px-6 py-4 ${!isLast ? "border-b border-[#1e293b]" : ""}`}
    >
      <code
        role="cell"
        className="text-sm font-mono text-[#818cf8] whitespace-nowrap pt-0.5 w-48 shrink-0"
        aria-label={`Function: ${step}`}
      >
        {step}
      </code>
      <span
        role="cell"
        className={`text-xs border rounded px-1.5 py-0.5 shrink-0 mt-0.5 ${colorClass}`}
        aria-label={`Actor: ${actor}`}
      >
        {actor}
      </span>
      <p role="cell" className="text-sm text-[#94a3b8]">{desc}</p>
    </div>
  );
}
