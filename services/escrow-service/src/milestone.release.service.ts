import { db } from "@gigmatch/db";
import { milestones } from "@gigmatch/db/src/schema/milestones";
import { eq } from "drizzle-orm";
import { emitEvent } from "@gigmatch/utils/src/kafka";

export async function releaseMilestone(
  milestoneId: string,
  actorId: string
) {
  const [milestone] = await db
    .update(milestones)
    .set({ status: "released" })
    .where(eq(milestones.id, milestoneId))
    .returning();

  // 🔔 Emit payment intent (no real money yet)
  await emitEvent("milestone.released", {
    milestoneId,
    escrowId: milestone.escrowId,
    amount: milestone.amount,
    releasedBy: actorId,
    releasedAt: new Date().toISOString()
  });

  return milestone;
}
