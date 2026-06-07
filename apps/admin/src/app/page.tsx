import { getLeads } from "@/app/actions/getLeads";
import LeadsTable from "@/app/components/LeadsTable";

export default async function AdminPage() {
  const leads = await getLeads();

  return (
    <div className="min-h-full bg-zinc-50 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">고객 문의 관리</h1>
          <p className="mt-1 text-sm text-zinc-500">
            총 {leads.length}건의 문의가 있습니다.
          </p>
        </div>
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
          <LeadsTable initialLeads={leads} />
        </div>
      </div>
    </div>
  );
}
