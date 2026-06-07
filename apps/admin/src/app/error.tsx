"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-50 px-4 py-16">
      <div className="text-center">
        <h2 className="text-xl font-bold text-zinc-900">오류가 발생했습니다</h2>
        <p className="mt-2 text-sm text-zinc-500">{error.message}</p>
        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
