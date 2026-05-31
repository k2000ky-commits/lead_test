"use server";

import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type UpdateInput = { id: number; name: string; phone: string; email: string };

export async function updateLead(data: UpdateInput): Promise<{ error?: string }> {
  try {
    await db
      .update(leads)
      .set({ name: data.name, phone: data.phone, email: data.email })
      .where(eq(leads.id, data.id));
    revalidatePath("/admin");
    return {};
  } catch {
    return { error: "수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
}
