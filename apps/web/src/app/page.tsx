import LeadForm from "./components/LeadForm";
import ErrorTrigger from "./components/ErrorTrigger";

export default function Home() {
  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-50 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-900">무료 상담 신청</h1>
          <p className="mt-2 text-sm text-zinc-500">
            정보를 남겨주시면 빠르게 연락드리겠습니다.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
          <LeadForm />
        </div>
        <div className="flex justify-center">
          <ErrorTrigger />
        </div>
      </div>
    </div>
  );
}
