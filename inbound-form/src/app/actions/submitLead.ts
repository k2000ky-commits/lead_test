"use server";

import { db } from "@/db";
import { leads } from "@/db/schema";

type LeadInput = { name: string; phone: string; email: string };

export async function submitLead(data: LeadInput): Promise<{ error?: string }> {
  try {
    await db.insert(leads).values(data);
    return {};
  } catch {
    return { error: "저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
}
