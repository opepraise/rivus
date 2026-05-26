export function LiveDot() {
  return (
    <span className="relative flex h-2 w-2" aria-hidden="true">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--accent) opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-(--accent)" />
    </span>
  );
}
