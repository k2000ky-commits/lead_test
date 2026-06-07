"use server";

import { db } from "@repo/db";
import { memos } from "@repo/db/schema";

export async function createMemo({ leadId, content }: { leadId: number; content: string }) {
  try {
    const [memo] = await db.insert(memos).values({ leadId, content }).returning();
    return { memo };
  } catch {
    return { error: "메모 저장 중 오류가 발생했습니다." };
  }
}
