interface SecurityItemProps {
  text: string;
}

export function SecurityItem({ text }: SecurityItemProps) {
  return (
    <li className="flex gap-3 group">
      <span
        className="text-[#6366f1] mt-0.5 shrink-0 group-hover:text-[#818cf8] transition-colors"
        aria-hidden="true"
      >
        &#8594;
      </span>
      <span className="group-hover:text-[#e2e8f0] transition-colors">{text}</span>
    </li>
  );
}
