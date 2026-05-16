interface LiveDotProps {
  color?: string;
  className?: string;
}

export function LiveDot({ color = "#6366f1", className = "" }: LiveDotProps) {
  return (
    <span className={`relative inline-flex h-2 w-2 ${className}`} aria-hidden="true">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}
