'use client';

import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { ConnectWallet } from './ConnectWallet';
import { OpenStreamForm } from './OpenStreamForm';
import { StreamList } from './StreamList';
import { TxBanner } from './TxBanner';
import { shortAddress } from '../lib/format';

export function DashboardClient() {
  const { address, isConnected, connect, disconnect } = useWallet();
  const [pendingTxId, setPendingTxId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleSuccess(txId: string) {
    setPendingTxId(txId);
  }

  function handleRefresh() {
    setPendingTxId(null);
    setRefreshKey(k => k + 1);
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Stream Dashboard</h1>
          {isConnected && address && (
            <p className="text-sm text-[#475569] mt-0.5 font-mono">{shortAddress(address)}</p>
          )}
        </div>
        {isConnected ? (
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="rounded-lg border border-[#1e293b] px-4 py-2 text-sm text-[#94a3b8] hover:text-white hover:border-[#6366f1] transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={disconnect}
              className="rounded-lg border border-[#1e293b] px-4 py-2 text-sm text-[#94a3b8] hover:text-white transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connect}
            className="rounded-lg bg-[#6366f1] px-5 py-2 text-sm font-medium text-white hover:bg-[#4f46e5] transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </div>

      <TxBanner txId={pendingTxId} onDismiss={() => setPendingTxId(null)} />

      {!isConnected && <ConnectWallet />}

      {isConnected && address && (
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          <OpenStreamForm onSuccess={handleSuccess} />
          <StreamList address={address} onSuccess={handleSuccess} refreshKey={refreshKey} />
        </div>
      )}
    </div>
  );
}
