'use client';

type Tab = 'sending' | 'receiving';

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
  sendingCount: number;
  receivingCount: number;
}

export function TabBar({ active, onChange, sendingCount, receivingCount }: Props) {
  return (
    <div className="flex gap-1 rounded-lg border border-[#1e293b] p-1 bg-[#0d1117]" role="tablist">
      {(['sending', 'receiving'] as Tab[]).map(tab => (
        <button
          key={tab}
          role="tab"
          aria-selected={active === tab}
          onClick={() => onChange(tab)}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            active === tab
              ? 'bg-[#6366f1] text-white'
              : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          {tab === 'sending' ? 'Sending' : 'Receiving'}
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${active === tab ? 'bg-white/20' : 'bg-[#1e293b]'}`}>
            {tab === 'sending' ? sendingCount : receivingCount}
          </span>
        </button>
      ))}
    </div>
  );
}
