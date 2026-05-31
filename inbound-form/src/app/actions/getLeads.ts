import { db } from "@/db";
import { leads } from "@/db/schema";
import { desc } from "drizzle-orm";

export type Lead = typeof leads.$inferSelect;

export async function getLeads(): Promise<Lead[]> {
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}
