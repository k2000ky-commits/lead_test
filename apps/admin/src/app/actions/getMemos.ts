"use server";

import { db } from "@repo/db";
import { memos } from "@repo/db/schema";
import { eq, desc } from "drizzle-orm";

export type Memo = typeof memos.$inferSelect;

export async function getMemosByLead(leadId: number): Promise<Memo[]> {
  return await db.select().from(memos).where(eq(memos.leadId, leadId)).orderBy(desc(memos.createdAt));
}
