export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      role="status"
      aria-label="Loading page content"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-8 w-8 rounded-full border-2 border-[#6366f1]/30 border-t-[#6366f1] animate-spin"
          aria-hidden="true"
        />
        <span className="text-sm text-[#94a3b8]">Loading…</span>
      </div>
    </div>
  );
}
