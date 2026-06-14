"use client";

import { useEffect } from "react";
import { reportError } from "./actions/reportError";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    reportError(error.message, error.digest);
  }, [error]);

  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-50 px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="mt-4 text-xl font-semibold text-zinc-900">오류가 발생했습니다</p>
          <p className="mt-2 text-sm text-zinc-500">
            일시적인 문제입니다. 잠시 후 다시 시도해주세요.
          </p>
          <button
            onClick={reset}
            className="mt-6 h-11 w-full rounded-xl bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  );
}
