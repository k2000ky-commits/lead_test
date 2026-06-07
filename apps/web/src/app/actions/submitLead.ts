"use server";

import { db } from "@repo/db";
import { leads } from "@repo/db/schema";

type LeadInput = { name: string; phone: string; email: string };

export async function submitLead(data: LeadInput): Promise<{ error?: string }> {
  if (!data.name.trim() || !data.phone.trim() || !data.email.trim()) {
    return { error: "모든 필드를 입력해주세요." };
  }
  if (data.name.length > 100 || data.phone.length > 50 || data.email.length > 254) {
    return { error: "입력값이 너무 깁니다." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    return { error: "올바른 이메일 형식이 아닙니다." };
  }

  try {
    await db.insert(leads).values({
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
    });
    return {};
  } catch {
    return { error: "저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
}
