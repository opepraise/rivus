import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-3 py-1 text-xs text-(--accent-muted)">
      {children}
    </div>
  );
}
