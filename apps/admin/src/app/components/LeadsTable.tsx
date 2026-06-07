"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import type { Lead } from "@/app/actions/getLeads";
import { updateLead } from "@/app/actions/updateLead";
import { deleteLead } from "@/app/actions/deleteLead";
import { getMemosByLead, type Memo } from "@/app/actions/getMemos";
import { createMemo } from "@/app/actions/createMemo";
import { deleteMemo } from "@/app/actions/deleteMemo";

type EditValues = { name: string; phone: string; email: string };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function toDateString(date: Date) {
  return new Date(date).toLocaleDateString("sv"); // YYYY-MM-DD, 로컬 타임존
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

  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [memosByLead, setMemosByLead] = useState<Record<number, Memo[]>>({});
  const [memoInput, setMemoInput] = useState("");
  const [memoLoading, setMemoLoading] = useState(false);

  const filteredLeads = leads.filter((l) => {
    const nameMatch = !filterName || l.name.includes(filterName);
    const dateMatch = !filterDate || toDateString(l.createdAt) === filterDate;
    return nameMatch && dateMatch;
  });

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
      if (expandedId === id) setExpandedId(null);
      setConfirmDeleteId(null);
      router.refresh();
    }
  }

  async function toggleMemo(leadId: number) {
    if (expandedId === leadId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(leadId);
    setMemoInput("");
    if (!memosByLead[leadId]) {
      const fetched = await getMemosByLead(leadId);
      setMemosByLead((prev) => ({ ...prev, [leadId]: fetched }));
    }
  }

  async function handleAddMemo(leadId: number) {
    if (!memoInput.trim()) return;
    setMemoLoading(true);
    const result = await createMemo({ leadId, content: memoInput.trim() });
    setMemoLoading(false);
    if (result.memo) {
      setMemosByLead((prev) => ({
        ...prev,
        [leadId]: [result.memo!, ...(prev[leadId] ?? [])],
      }));
      setMemoInput("");
    }
  }

  async function handleDeleteMemo(leadId: number, memoId: number) {
    await deleteMemo(memoId);
    setMemosByLead((prev) => ({
      ...prev,
      [leadId]: (prev[leadId] ?? []).filter((m) => m.id !== memoId),
    }));
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
      <div className="flex flex-wrap items-center gap-3 border-b border-zinc-200 px-4 py-3">
        <input
          type="text"
          placeholder="이름 검색"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="h-9 w-36 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        {(filterName || filterDate) && (
          <button
            onClick={() => { setFilterName(""); setFilterDate(""); }}
            className="text-sm text-zinc-400 hover:text-zinc-600"
          >
            초기화
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="mx-4 mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {filteredLeads.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-sm text-zinc-400">
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">이름</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">전화번호</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">이메일</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">신청일시</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const isEditing = editingId === lead.id;
                const isConfirmDelete = confirmDeleteId === lead.id;
                const isBusy = pendingId === lead.id;
                const isExpanded = expandedId === lead.id;
                const leadMemos = memosByLead[lead.id];

                return (
                  <Fragment key={lead.id}>
                    <tr className="border-t border-zinc-100 hover:bg-zinc-50">
                      <td className="px-4 py-3 text-sm text-zinc-700">
                        {isEditing ? (
                          <input
                            value={editValues.name}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, name: e.target.value }))}
                            disabled={isBusy}
                            className={inputClass}
                          />
                        ) : lead.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-700">
                        {isEditing ? (
                          <input
                            value={editValues.phone}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, phone: e.target.value }))}
                            disabled={isBusy}
                            className={inputClass}
                          />
                        ) : lead.phone}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-700">
                        {isEditing ? (
                          <input
                            value={editValues.email}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, email: e.target.value }))}
                            disabled={isBusy}
                            className={inputClass}
                          />
                        ) : lead.email}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-500">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {isEditing ? (
                            <>
                              <button onClick={() => handleSave(lead.id)} disabled={isBusy} className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-50">
                                {isBusy ? "저장 중..." : "저장"}
                              </button>
                              <button onClick={() => setEditingId(null)} disabled={isBusy} className="text-sm text-zinc-500 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50">
                                취소
                              </button>
                            </>
                          ) : isConfirmDelete ? (
                            <>
                              <span className="text-sm text-zinc-600">삭제할까요?</span>
                              <button onClick={() => handleDelete(lead.id)} disabled={isBusy} className="text-sm font-medium text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50">
                                {isBusy ? "삭제 중..." : "확인"}
                              </button>
                              <button onClick={() => setConfirmDeleteId(null)} disabled={isBusy} className="text-sm text-zinc-500 hover:text-zinc-700">
                                취소
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(lead)} className="text-sm font-medium text-blue-600 hover:text-blue-800">수정</button>
                              <button onClick={() => { setConfirmDeleteId(lead.id); setEditingId(null); }} className="text-sm font-medium text-red-500 hover:text-red-700">삭제</button>
                              <button
                                onClick={() => toggleMemo(lead.id)}
                                className={`text-sm font-medium ${isExpanded ? "text-amber-600 hover:text-amber-800" : "text-zinc-500 hover:text-zinc-700"}`}
                              >
                                메모{leadMemos ? ` (${leadMemos.length})` : ""}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="bg-amber-50 px-6 py-4">
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="메모 입력 후 Enter 또는 추가 클릭"
                                value={memoInput}
                                onChange={(e) => setMemoInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleAddMemo(lead.id); }}
                                disabled={memoLoading}
                                className="h-9 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
                              />
                              <button
                                onClick={() => handleAddMemo(lead.id)}
                                disabled={memoLoading || !memoInput.trim()}
                                className="rounded-lg bg-amber-500 px-4 text-sm font-medium text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {memoLoading ? "저장 중..." : "추가"}
                              </button>
                            </div>
                            {leadMemos === undefined ? (
                              <p className="text-sm text-zinc-400">불러오는 중...</p>
                            ) : leadMemos.length === 0 ? (
                              <p className="text-sm text-zinc-400">메모가 없습니다.</p>
                            ) : (
                              <ul className="space-y-2">
                                {leadMemos.map((memo) => (
                                  <li key={memo.id} className="flex items-start justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-zinc-100">
                                    <div>
                                      <p className="text-zinc-800">{memo.content}</p>
                                      <p className="mt-0.5 text-xs text-zinc-400">{formatDate(memo.createdAt)}</p>
                                    </div>
                                    <button
                                      onClick={() => handleDeleteMemo(lead.id, memo.id)}
                                      className="shrink-0 text-xs text-zinc-400 hover:text-red-500"
                                    >
                                      삭제
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
