export function LiveDot() {
  return (
    <span className="relative flex h-2 w-2" aria-hidden="true">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6366f1] opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6366f1]" />
    </span>
  );
}
