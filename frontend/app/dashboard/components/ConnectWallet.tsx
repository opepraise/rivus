'use client';

import { useWallet } from '../context/WalletContext';

export function ConnectWallet() {
  const { connect } = useWallet();
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-[#6366f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
        </svg>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Connect your wallet</h2>
        <p className="text-[#94a3b8] max-w-sm">
          Connect a Stacks wallet to open streams, withdraw earnings, and manage your payment flows.
        </p>
      </div>
      <button
        onClick={connect}
        className="rounded-lg bg-[#6366f1] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#4f46e5] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
      >
        Connect Wallet
      </button>
    </div>
  );
}
