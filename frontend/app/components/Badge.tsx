interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning";
}

const variants = {
  default: "text-[#818cf8] border-[#6366f1]/30 bg-[#6366f1]/10",
  success: "text-green-400 border-green-500/30 bg-green-500/10",
  warning: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
