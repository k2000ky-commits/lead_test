"use server";

import { db } from "@repo/db";
import { leads } from "@repo/db/schema";
import { desc } from "drizzle-orm";

export type Lead = typeof leads.$inferSelect;

export async function getLeads(): Promise<Lead[]> {
  try {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  } catch {
    throw new Error("고객 목록을 불러오는 중 오류가 발생했습니다.");
  }
}
