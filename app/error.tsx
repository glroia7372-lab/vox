'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-6">
        <h2 className="text-3xl font-serif mb-4">Something went wrong!</h2>
        <p className="text-gray-500 mb-8">{error.message}</p>
        <button
          onClick={() => reset()}
          className="px-8 py-4 bg-vox-red text-white rounded-full font-bold hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
