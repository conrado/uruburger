'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ClockService, ClockResponse } from '@/lib/api';

export default function ApiExample() {
  const [timeData, setTimeData] = useState<ClockResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchServerTime = async () => {
    setLoading(true);
    try {
      // Using our ClockService to get the time
      const clockService = new ClockService();
      const data = await clockService.getTime();
      setTimeData(data);
    } catch (error) {
      console.error('Error fetching server time:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
      <h1 className="text-3xl font-bold">Client-Side API Example</h1>

      <div className="flex flex-col items-center gap-6 max-w-lg w-full">
        <p className="text-center">
          This page demonstrates how to fetch the server time directly from the
          client. Unlike the main page which uses Server-Side Rendering, this
          uses client-side JavaScript.
        </p>

        {timeData ? (
          <div className="bg-black/[.05] dark:bg-white/[.06] px-6 py-4 rounded-lg w-full">
            <p className="text-xl font-mono">
              {new Date(timeData.time).toLocaleString()}
            </p>
            <p className="text-xs mt-2 opacity-70">
              Timestamp: {timeData.timestamp}
            </p>
          </div>
        ) : (
          <p>No time data yet. Click the button below to fetch it.</p>
        )}

        <button
          onClick={fetchServerTime}
          disabled={loading}
          className="rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 font-medium transition-colors"
        >
          {loading ? 'Loading...' : 'Fetch Server Time'}
        </button>

        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
