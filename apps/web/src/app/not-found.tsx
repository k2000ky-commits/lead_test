import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-50 px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
          <p className="text-5xl font-bold text-zinc-200">404</p>
          <p className="mt-4 text-xl font-semibold text-zinc-900">페이지를 찾을 수 없습니다</p>
          <p className="mt-2 text-sm text-zinc-500">요청하신 페이지가 존재하지 않습니다.</p>
          <Link
            href="/"
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
