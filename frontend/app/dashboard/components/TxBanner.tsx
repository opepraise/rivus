'use client';

import { EXPLORER_BASE } from '../constants';

export function TxBanner({ txId, onDismiss }: { txId: string | null; onDismiss: () => void }) {
  if (!txId) return null;
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-3 text-sm">
      <span className="text-emerald-300">
        Transaction submitted —{' '}
        <a
          href={`${EXPLORER_BASE}/txid/${txId}?chain=mainnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-emerald-200"
        >
          view on Explorer
        </a>
      </span>
      <button
        onClick={onDismiss}
        className="text-emerald-400/60 hover:text-emerald-300 transition-colors text-lg leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
