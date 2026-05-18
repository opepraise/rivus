"use client";

export function BackToTop() {
  return (
    <div className="max-w-5xl mx-auto px-6 pb-8 flex justify-end">
      <a
        href="#main-content"
        className="text-xs text-[#475569] hover:text-[#94a3b8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] rounded"
      >
        ↑ Back to top
      </a>
    </div>
  );
}
