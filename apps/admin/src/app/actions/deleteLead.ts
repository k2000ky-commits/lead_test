"use server";

import { db } from "@repo/db";
import { leads } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteLead(id: number): Promise<{ error?: string }> {
  if (!Number.isInteger(id) || id <= 0) {
    return { error: "잘못된 요청입니다." };
  }

  try {
    const deleted = await db
      .delete(leads)
      .where(eq(leads.id, id))
      .returning({ id: leads.id });
    if (deleted.length === 0) {
      return { error: "이미 삭제되었거나 존재하지 않는 항목입니다." };
    }
    revalidatePath("/");
    return {};
  } catch {
    return { error: "삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
}
