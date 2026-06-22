'use client';

import { WalletProvider } from '../context/WalletContext';
import { DashboardClient } from './DashboardClient';

export function DashboardShell() {
  return (
    <WalletProvider>
      <DashboardClient />
    </WalletProvider>
  );
}
