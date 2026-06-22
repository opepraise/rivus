'use client';

import { useEffect, useState } from 'react';
import { fetchStreamsForAddress, fetchWithdrawable } from '../lib/stacks';
import { StreamCard } from './StreamCard';
import { TabBar } from './TabBar';
import type { Stream } from '../types';

interface Props {
  address: string;
  onSuccess: (txId: string) => void;
  refreshKey: number;
}

export function StreamList({ address, onSuccess, refreshKey }: Props) {
  const [sending, setSending] = useState<Stream[]>([]);
  const [receiving, setReceiving] = useState<Stream[]>([]);
  const [withdrawables, setWithdrawables] = useState<Record<number, bigint>>({});
  const [tab, setTab] = useState<'sending' | 'receiving'>('sending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    setError('');

    fetchStreamsForAddress(address)
      .then(async ({ sending, receiving }) => {
        setSending(sending);
        setReceiving(receiving);

        const all = [...sending, ...receiving];
        const entries = await Promise.all(
          all.map(async s => {
            const w = await fetchWithdrawable(s.id).catch(() => 0n);
            return [s.id, w] as [number, bigint];
          })
        );
        setWithdrawables(Object.fromEntries(entries));
      })
      .catch(() => setError('Failed to load streams. Please try again.'))
      .finally(() => setLoading(false));
  }, [address, refreshKey]);

  const streams = tab === 'sending' ? sending : receiving;

  return (
    <section className="space-y-4">
      <TabBar
        active={tab}
        onChange={setTab}
        sendingCount={sending.length}
        receivingCount={receiving.length}
      />

      {loading && (
        <div className="text-center py-12 text-[#475569] text-sm">Loading streams…</div>
      )}

      {!loading && error && (
        <div className="text-center py-12 text-red-400 text-sm">{error}</div>
      )}

      {!loading && !error && streams.length === 0 && (
        <div className="text-center py-12 text-[#475569] text-sm">
          No {tab} streams yet.
        </div>
      )}

      {!loading && !error && streams.length > 0 && (
        <div className="space-y-3">
          {streams.map(stream => (
            <StreamCard
              key={stream.id}
              stream={stream}
              walletAddress={address}
              withdrawable={withdrawables[stream.id] ?? 0n}
              onSuccess={onSuccess}
            />
          ))}
        </div>
      )}
    </section>
  );
}
