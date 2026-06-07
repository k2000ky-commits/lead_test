"use server";

import { db } from "@repo/db";
import { memos } from "@repo/db/schema";
import { eq } from "drizzle-orm";

export async function deleteMemo(id: number) {
  try {
    await db.delete(memos).where(eq(memos.id, id));
    return {};
  } catch {
    return { error: "메모 삭제 중 오류가 발생했습니다." };
  }
}
