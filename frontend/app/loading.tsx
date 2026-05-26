export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      role="status"
      aria-label="Loading page content"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-8 w-8 rounded-full border-2 border-(--accent)/30 border-t-(--accent) animate-spin"
          aria-hidden="true"
        />
        <span className="text-sm text-(--text-muted) animate-pulse">Loading…</span>
      </div>
    </div>
  );
}
