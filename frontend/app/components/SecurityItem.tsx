interface SecurityItemProps {
  text: string;
}

export function SecurityItem({ text }: SecurityItemProps) {
  return (
    <li className="flex gap-3">
      <span className="text-[#6366f1] mt-0.5 shrink-0" aria-hidden="true">
        &#8594;
      </span>
      <span>{text}</span>
    </li>
  );
}
