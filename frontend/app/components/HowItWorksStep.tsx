interface HowItWorksStepProps {
  number: string;
  title: string;
  desc: string;
  isLast?: boolean;
}

export function HowItWorksStep({ number, title, desc, isLast = false }: HowItWorksStepProps) {
  return (
    <li className="relative flex gap-6">
      <div className="flex flex-col items-center">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#6366f1]/40 bg-[#6366f1]/10"
          aria-hidden="true"
        >
          <span className="font-mono text-xs font-bold text-[#818cf8] tabular-nums">
            {number}
          </span>
        </div>
        {!isLast && (
          <div className="mt-2 w-px flex-1 bg-[#1e293b]" aria-hidden="true" />
        )}
      </div>
      <div className="pb-8 space-y-1">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-sm text-[#94a3b8] leading-relaxed">{desc}</p>
      </div>
    </li>
  );
}
