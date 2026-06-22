import type { StreamStatus } from '../types';

const styles: Record<StreamStatus, string> = {
  active:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  paused:    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  completed: 'bg-[#818cf8]/10 text-[#818cf8] border-[#818cf8]/20',
};

const labels: Record<StreamStatus, string> = {
  active: 'Active', paused: 'Paused', cancelled: 'Cancelled', completed: 'Completed',
};

export function StatusBadge({ status }: { status: StreamStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
