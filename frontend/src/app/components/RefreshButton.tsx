'use client';

import { useRouter } from 'next/navigation';

export function RefreshButton() {
  const router = useRouter();

  const handleRefresh = () => {
    // This will cause a full page refresh, fetching new data from the server
    router.refresh();
  };

  return (
    <button
      onClick={handleRefresh}
      className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-medium transition-colors"
    >
      Refresh Server Time
    </button>
  );
}
