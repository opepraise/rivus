interface ArchitectureLayerProps {
  label: string;
  components: string[];
  desc: string;
  isLast?: boolean;
}

export function ArchitectureLayer({ label, components, desc, isLast = false }: ArchitectureLayerProps) {
  return (
    <div className={`flex items-start gap-4 px-6 py-4 ${!isLast ? "border-b border-[#1e293b]" : ""}`}>
      <div className="w-36 shrink-0 pt-0.5">
        <span className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex flex-wrap gap-1.5">
          {components.map((c) => (
            <code
              key={c}
              className="text-xs font-mono text-[#818cf8] bg-[#6366f1]/10 border border-[#6366f1]/20 rounded px-1.5 py-0.5"
            >
              {c}
            </code>
          ))}
        </div>
        <p className="text-sm text-[#94a3b8] leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}
