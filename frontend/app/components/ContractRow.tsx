interface ContractRowProps {
  name: string;
  role: string;
  isLast?: boolean;
}

export function ContractRow({ name, role, isLast = false }: ContractRowProps) {
  return (
    <div
      role="row"
      className={`flex items-start gap-4 px-6 py-4 ${!isLast ? "border-b border-[#1e293b]" : ""}`}
    >
      <code
        role="cell"
        className="text-sm font-mono text-[#818cf8] whitespace-nowrap pt-0.5 w-44 shrink-0"
        aria-label={`Contract: ${name}`}
      >
        {name}
      </code>
      <p role="cell" className="text-sm text-[#94a3b8]">{role}</p>
    </div>
  );
}
