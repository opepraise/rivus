'use client';

import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { CONTRACT_OWNER, REGISTRY_NAME } from '../constants';
import { microStxToStx, shortAddress, getStreamStatus, streamProgress, stxToMicroStx } from '../lib/format';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import type { Stream } from '../types';

interface Props {
  stream: Stream;
  walletAddress: string;
  withdrawable: bigint;
  onSuccess: (txId: string) => void;
}

function ActionButton({ label, onClick, disabled, variant = 'default' }: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger' | 'primary';
}) {
  const base = 'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const styles = {
    default: 'border border-[#1e293b] text-[#94a3b8] hover:border-[#6366f1] hover:text-[#818cf8]',
    danger: 'border border-red-500/30 text-red-400 hover:bg-red-500/10',
    primary: 'bg-[#6366f1] text-white hover:bg-[#4f46e5]',
  };
  return (
    <button className={`${base} ${styles[variant]}`} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

export function StreamCard({ stream, walletAddress, withdrawable, onSuccess }: Props) {
  const [topUpAmount, setTopUpAmount] = useState('');
  const [showTopUp, setShowTopUp] = useState(false);
  const [busy, setBusy] = useState(false);

  const status = getStreamStatus(stream);
  const isSender = stream.sender === walletAddress;
  const isRecipient = stream.recipient === walletAddress;
  const pct = streamProgress(stream);

  async function callAction(functionName: string, args: Parameters<typeof uintCV>[0][] = []) {
    setBusy(true);
    await openContractCall({
      contractAddress: CONTRACT_OWNER,
      contractName: REGISTRY_NAME,
      functionName,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      functionArgs: [uintCV(BigInt(stream.id)), ...args] as any[],
      network: STACKS_MAINNET,
      onFinish: ({ txId }: { txId: string }) => { onSuccess(txId); setBusy(false); },
      onCancel: () => setBusy(false),
    });
  }

  async function handleTopUp() {
    const amt = parseFloat(topUpAmount);
    if (isNaN(amt) || amt <= 0) return;
    setBusy(true);
    await openContractCall({
      contractAddress: CONTRACT_OWNER,
      contractName: REGISTRY_NAME,
      functionName: 'top-up-stream',
      functionArgs: [uintCV(BigInt(stream.id)), uintCV(stxToMicroStx(amt))],
      network: STACKS_MAINNET,
      onFinish: ({ txId }: { txId: string }) => {
        onSuccess(txId);
        setTopUpAmount('');
        setShowTopUp(false);
        setBusy(false);
      },
      onCancel: () => setBusy(false),
    });
  }

  return (
    <div className="rounded-xl border border-[#1e293b] bg-[#0d1117] p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs text-[#475569] font-mono">#{stream.id}</span>
          <p className="text-sm text-white mt-0.5">
            {isSender ? (
              <><span className="text-[#94a3b8]">To</span> <span className="font-mono">{shortAddress(stream.recipient)}</span></>
            ) : (
              <><span className="text-[#94a3b8]">From</span> <span className="font-mono">{shortAddress(stream.sender)}</span></>
            )}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-[#475569]">Total</p>
          <p className="text-sm font-medium text-white">{microStxToStx(stream.totalAmount)} STX</p>
        </div>
        <div>
          <p className="text-xs text-[#475569]">Withdrawn</p>
          <p className="text-sm font-medium text-white">{microStxToStx(stream.withdrawn)} STX</p>
        </div>
        <div>
          <p className="text-xs text-[#475569]">Accrued</p>
          <p className="text-sm font-medium text-emerald-400">{microStxToStx(withdrawable)} STX</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <ProgressBar pct={pct} />
        <p className="text-xs text-[#475569] text-right">{pct.toFixed(1)}% streamed</p>
      </div>

      {/* Rate */}
      <p className="text-xs text-[#475569]">
        Rate: <span className="text-[#94a3b8]">{microStxToStx(stream.ratePerBlock)} STX/block</span>
        {' · '}Blocks: <span className="text-[#94a3b8]">{stream.startBlock}→{stream.endBlock}</span>
      </p>

      {/* Actions */}
      {status !== 'cancelled' && status !== 'completed' && (
        <div className="flex flex-wrap gap-2 pt-1">
          {isRecipient && withdrawable > 0n && (
            <ActionButton label="Withdraw" variant="primary" disabled={busy} onClick={() => callAction('withdraw-from-stream')} />
          )}
          {isSender && status === 'active' && (
            <ActionButton label="Pause" disabled={busy} onClick={() => callAction('pause-stream')} />
          )}
          {isSender && status === 'paused' && (
            <ActionButton label="Resume" disabled={busy} onClick={() => callAction('resume-stream')} />
          )}
          {isSender && (
            <ActionButton label="Top-up" disabled={busy} onClick={() => setShowTopUp(v => !v)} />
          )}
          {isSender && (
            <ActionButton label="Cancel" variant="danger" disabled={busy} onClick={() => callAction('cancel-stream')} />
          )}
        </div>
      )}

      {/* Top-up inline */}
      {showTopUp && (
        <div className="flex gap-2 pt-1">
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount in STX"
            value={topUpAmount}
            onChange={e => setTopUpAmount(e.target.value)}
            className="flex-1 rounded-lg border border-[#1e293b] bg-[#080b0f] px-3 py-1.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6366f1]"
          />
          <button
            onClick={handleTopUp}
            disabled={busy}
            className="px-3 py-1.5 rounded-lg bg-[#6366f1] text-white text-xs font-medium hover:bg-[#4f46e5] disabled:opacity-40"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
