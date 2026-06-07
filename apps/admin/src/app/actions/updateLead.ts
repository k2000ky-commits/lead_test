"use server";

import { db } from "@repo/db";
import { leads } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type UpdateInput = { id: number; name: string; phone: string; email: string };

export async function updateLead(data: UpdateInput): Promise<{ error?: string }> {
  if (!Number.isInteger(data.id) || data.id <= 0) {
    return { error: "잘못된 요청입니다." };
  }
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
    const updated = await db
      .update(leads)
      .set({ name: data.name.trim(), phone: data.phone.trim(), email: data.email.trim() })
      .where(eq(leads.id, data.id))
      .returning({ id: leads.id });
    if (updated.length === 0) {
      return { error: "해당 고객 정보를 찾을 수 없습니다." };
    }
    revalidatePath("/");
    return {};
  } catch {
    return { error: "수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
}
