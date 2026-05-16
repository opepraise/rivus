interface SectionHeadingProps {
  id: string;
  title: string;
  subtitle?: string;
}

export function SectionHeading({ id, title, subtitle }: SectionHeadingProps) {
  return (
    <div>
      <h2 id={id} className="text-2xl font-semibold text-white">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-[#94a3b8]">{subtitle}</p>}
    </div>
  );
}
