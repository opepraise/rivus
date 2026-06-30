'use client';

import dynamic from 'next/dynamic';

const DashboardShell = dynamic(
  () => import('./DashboardShell').then(m => m.DashboardShell),
  {
    ssr: false,
    loading: () => (
      <div className="py-24 text-center text-[#475569] text-sm">
        Loading dashboard…
      </div>
    ),
  }
);

export function DashboardWrapper() {
  return <DashboardShell />;
}
