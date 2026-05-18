interface SecurityItemProps {
  text: string;
}

export function SecurityItem({ text }: SecurityItemProps) {
  return (
    <li className="group flex gap-3">
      <span className="text-[#6366f1] mt-0.5 shrink-0 group-hover:text-[#818cf8] transition-colors" aria-hidden="true">
        &#8594;
      </span>
      <span className="group-hover:text-[#cbd5e1] transition-colors">{text}</span>
    </li>
  );
}
