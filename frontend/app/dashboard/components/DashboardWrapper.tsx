'use client';

import { useEffect, useState, type ComponentType } from 'react';

export function DashboardWrapper() {
  const [Shell, setShell] = useState<ComponentType | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    import('./DashboardShell')
      .then(m => setShell(() => m.DashboardShell))
      .catch(() => setLoadError(true));
  }, []);

  if (loadError) {
    return (
      <div className="py-24 text-center space-y-3">
        <p className="text-red-400 text-sm">Failed to load dashboard.</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-[#6366f1] underline"
        >
          Reload page
        </button>
      </div>
    );
  }

  if (!Shell) {
    return (
      <div className="py-24 text-center text-[#475569] text-sm">
        Loading dashboard…
      </div>
    );
  }

  return <Shell />;
}
