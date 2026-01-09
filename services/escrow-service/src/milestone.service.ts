import { db } from "@gigmatch/db";
import { milestones } from "@gigmatch/db/src/schema/milestones";
import { eq } from "drizzle-orm";
import { CreateMilestoneDTO } from "./milestone.dto";

/**
 * Create milestone for an escrow
 */
export async function createMilestone(input: CreateMilestoneDTO) {
  const [milestone] = await db
    .insert(milestones)
    .values({
      escrowId: input.escrowId,
      title: input.title,
      amount: input.amount,
      status: "pending"
    })
    .returning();

  return milestone;
}

/**
 * List milestones for escrow
 */
export async function listMilestones(escrowId: string) {
  return db
    .select()
    .from(milestones)
    .where(eq(milestones.escrowId, escrowId));
}
