"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Lead } from "@/app/actions/getLeads";
import { updateLead } from "@/app/actions/updateLead";
import { deleteLead } from "@/app/actions/deleteLead";

type EditValues = { name: string; phone: string; email: string };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

const inputClass =
  "h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:opacity-60";

export default function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({ name: "", phone: "", email: "" });
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function startEdit(lead: Lead) {
    setEditingId(lead.id);
    setEditValues({ name: lead.name, phone: lead.phone, email: lead.email });
    setConfirmDeleteId(null);
    setErrorMessage(null);
  }

  async function handleSave(id: number) {
    setPendingId(id);
    setErrorMessage(null);
    const result = await updateLead({ id, ...editValues });
    setPendingId(null);
    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...editValues } : l)));
      setEditingId(null);
      router.refresh();
    }
  }

  async function handleDelete(id: number) {
    setPendingId(id);
    setErrorMessage(null);
    const result = await deleteLead(id);
    setPendingId(null);
    if (result.error) {
      setErrorMessage(result.error);
      setConfirmDeleteId(null);
    } else {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setConfirmDeleteId(null);
      router.refresh();
    }
  }

  if (leads.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-zinc-400">
        아직 접수된 문의가 없습니다.
      </div>
    );
  }

  return (
    <div>
      {errorMessage && (
        <div className="mx-4 mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                이름
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                전화번호
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                이메일
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                신청일시
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const isEditing = editingId === lead.id;
              const isConfirmDelete = confirmDeleteId === lead.id;
              const isBusy = pendingId === lead.id;

              return (
                <tr key={lead.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                  <td className="px-4 py-3 text-sm text-zinc-700">
                    {isEditing ? (
                      <input
                        value={editValues.name}
                        onChange={(e) =>
                          setEditValues((prev) => ({ ...prev, name: e.target.value }))
                        }
                        disabled={isBusy}
                        className={inputClass}
                      />
                    ) : (
                      lead.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-700">
                    {isEditing ? (
                      <input
                        value={editValues.phone}
                        onChange={(e) =>
                          setEditValues((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        disabled={isBusy}
                        className={inputClass}
                      />
                    ) : (
                      lead.phone
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-700">
                    {isEditing ? (
                      <input
                        value={editValues.email}
                        onChange={(e) =>
                          setEditValues((prev) => ({ ...prev, email: e.target.value }))
                        }
                        disabled={isBusy}
                        className={inputClass}
                      />
                    ) : (
                      lead.email
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-500">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleSave(lead.id)}
                          disabled={isBusy}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isBusy ? "저장 중..." : "저장"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          disabled={isBusy}
                          className="text-sm text-zinc-500 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          취소
                        </button>
                      </div>
                    ) : isConfirmDelete ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-zinc-600">정말 삭제하시겠습니까?</span>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          disabled={isBusy}
                          className="text-sm font-medium text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isBusy ? "삭제 중..." : "삭제 확인"}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          disabled={isBusy}
                          className="text-sm text-zinc-500 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => startEdit(lead)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => {
                            setConfirmDeleteId(lead.id);
                            setEditingId(null);
                          }}
                          className="text-sm font-medium text-red-500 hover:text-red-700"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
