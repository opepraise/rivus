interface SecurityItemProps {
  text: string;
}

export function SecurityItem({ text }: SecurityItemProps) {
  return (
    <li className="group flex gap-3">
      <span className="text-(--accent) mt-0.5 shrink-0 group-hover:text-(--accent-muted) transition-colors" aria-hidden="true">
        &#8594;
      </span>
      <span className="group-hover:text-[#cbd5e1] transition-colors">{text}</span>
    </li>
  );
}
