'use client';

import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { principalCV, uintCV } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { CONTRACT_OWNER, REGISTRY_NAME, BLOCKS_PER_DAY, MIN_STREAM_AMOUNT_STX } from '../constants';
import { stxToMicroStx } from '../lib/format';
import { fetchCurrentBlock } from '../lib/stacks';

interface Props {
  onSuccess: (txId: string) => void;
}

export function OpenStreamForm({ onSuccess }: Props) {
  const [recipient, setRecipient] = useState('');
  const [amountStx, setAmountStx] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validate = (): string => {
    if (!recipient.startsWith('SP') && !recipient.startsWith('SM')) return 'Invalid Stacks mainnet address';
    const amt = parseFloat(amountStx);
    if (isNaN(amt) || amt < MIN_STREAM_AMOUNT_STX) return `Minimum amount is ${MIN_STREAM_AMOUNT_STX} STX`;
    const days = parseInt(durationDays, 10);
    if (isNaN(days) || days < 1) return 'Minimum duration is 1 day';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setSubmitting(true);

    try {
      const currentBlock = await fetchCurrentBlock();
      const durationBlocks = parseInt(durationDays, 10) * BLOCKS_PER_DAY;
      const startBlock = currentBlock + 2;
      const endBlock = startBlock + durationBlocks;
      const microStx = stxToMicroStx(parseFloat(amountStx));

      await openContractCall({
        contractAddress: CONTRACT_OWNER,
        contractName: REGISTRY_NAME,
        functionName: 'open-stream',
        functionArgs: [
          principalCV(recipient),
          uintCV(microStx),
          uintCV(BigInt(startBlock)),
          uintCV(BigInt(endBlock)),
        ],
        network: STACKS_MAINNET,
        onFinish: ({ txId }: { txId: string }) => {
          onSuccess(txId);
          setRecipient('');
          setAmountStx('');
          setDurationDays('');
          setSubmitting(false);
        },
        onCancel: () => setSubmitting(false),
      });
    } catch {
      setError('Failed to open stream. Check your wallet and try again.');
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-xl border border-[#1e293b] bg-[#0d1117] p-6 space-y-5">
      <h2 className="text-lg font-semibold text-white">Open a stream</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="recipient" className="block text-xs font-medium text-[#94a3b8] uppercase tracking-wide">
            Recipient address
          </label>
          <input
            id="recipient"
            type="text"
            placeholder="SP..."
            value={recipient}
            onChange={e => setRecipient(e.target.value.trim())}
            className="w-full rounded-lg border border-[#1e293b] bg-[#080b0f] px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6366f1] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="amount" className="block text-xs font-medium text-[#94a3b8] uppercase tracking-wide">
              Amount (STX)
            </label>
            <input
              id="amount"
              type="number"
              min={MIN_STREAM_AMOUNT_STX}
              step="0.01"
              placeholder="1.00"
              value={amountStx}
              onChange={e => setAmountStx(e.target.value)}
              className="w-full rounded-lg border border-[#1e293b] bg-[#080b0f] px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6366f1] transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="duration" className="block text-xs font-medium text-[#94a3b8] uppercase tracking-wide">
              Duration (days)
            </label>
            <input
              id="duration"
              type="number"
              min={1}
              step={1}
              placeholder="30"
              value={durationDays}
              onChange={e => setDurationDays(e.target.value)}
              className="w-full rounded-lg border border-[#1e293b] bg-[#080b0f] px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6366f1] transition-colors"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#6366f1] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#4f46e5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Waiting for wallet…' : 'Open stream'}
        </button>
      </form>
    </section>
  );
}
