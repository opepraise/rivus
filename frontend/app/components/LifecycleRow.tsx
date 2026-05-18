import type { LifecycleActor } from "../data";

interface LifecycleRowProps {
  step: string;
  actor: LifecycleActor;
  desc: string;
  isLast?: boolean;
}

export function LifecycleRow({ step, actor, desc, isLast = false }: LifecycleRowProps) {
  return (
    <div
      role="row"
      className={`flex items-start gap-4 px-6 py-4 ${!isLast ? "border-b border-[#1e293b]" : ""}`}
    >
      <code
        role="cell"
        className="text-sm font-mono text-[#818cf8] whitespace-nowrap pt-0.5 w-48 shrink-0"
      >
        {step}
      </code>
      <span
        role="cell"
        className={`text-xs rounded px-1.5 py-0.5 shrink-0 mt-0.5 border ${
          actor === "sender"
            ? "text-[#6366f1] bg-[#6366f1]/10 border-[#6366f1]/20"
            : "text-[#34d399] bg-[#34d399]/10 border-[#34d399]/20"
        }`}
      >
        {actor}
      </span>
      <p role="cell" className="text-sm text-[#94a3b8]">{desc}</p>
    </div>
  );
}
