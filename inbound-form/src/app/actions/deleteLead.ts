"use server";

import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteLead(id: number): Promise<{ error?: string }> {
  try {
    await db.delete(leads).where(eq(leads.id, id));
    revalidatePath("/admin");
    return {};
  } catch {
    return { error: "삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
}
