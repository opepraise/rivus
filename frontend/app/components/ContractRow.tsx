interface ContractRowProps {
  name: string;
  role: string;
  address: string;
  explorerUrl: string;
  isLast?: boolean;
}

export function ContractRow({ name, role, address, explorerUrl, isLast = false }: ContractRowProps) {
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
      <div role="cell" className="flex flex-col gap-1 min-w-0">
        <p className="text-sm text-[#94a3b8]">{role}</p>
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-[#475569] hover:text-[#818cf8] transition-colors truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818cf8] rounded"
        >
          {address}
        </a>
      </div>
    </div>
  );
}
