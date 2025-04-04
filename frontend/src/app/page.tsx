import Image from 'next/image';
import { RefreshButton } from './components/RefreshButton';

// This is a server component that fetches data on the server for each request
async function getServerTime() {
  // Using relative URL assuming backend is proxied or on the same domain
  // In development you might need to use the full URL: http://localhost:3001/clock
  const res = await fetch('http://localhost:3001/clock', {
    cache: 'no-store', // Ensures fresh data on every request
  });

  if (!res.ok) {
    throw new Error('Failed to fetch server time');
  }

  return res.json();
}

export default async function Home() {
  // This is executed on the server for each request
  const serverTimeData = await getServerTime();
  const formattedTime = new Date(serverTimeData.time).toLocaleString();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold">Uruburger Server Time</h1>
          <div className="bg-black/[.05] dark:bg-white/[.06] px-6 py-4 rounded-lg">
            <p className="text-xl font-[family-name:var(--font-geist-mono)]">
              {formattedTime}
            </p>
            <p className="text-xs mt-2 opacity-70">
              Timestamp: {serverTimeData.timestamp}
            </p>
          </div>
          <RefreshButton />
        </div>

        <div className="text-center mt-8">
          <p className="mb-4">
            This page fetches the time from your backend API using Server-Side
            Rendering.
          </p>
          <p>
            Click the refresh button to request a new page with a fresh time
            from the server.
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 w-full my-6"></div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="/api-example"
          >
            View API Example
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className="text-sm opacity-70">
          Uruburger © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
