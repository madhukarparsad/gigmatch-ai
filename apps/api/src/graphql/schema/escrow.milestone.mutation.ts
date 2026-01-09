import { GraphQLString } from "graphql";
import { db } from "@gigmatch/db";
import { escrowMilestones } from "@gigmatch/db/src/schema/escrow_milestones";
import { escrows } from "@gigmatch/db/src/schema/escrow";
import { emitEvent } from "@gigmatch/utils/src/kafka";
import { eq, sql } from "drizzle-orm";

export const EscrowMilestoneMutations = {
  releaseMilestone: {
    type: GraphQLString,
    args: {
      milestoneId: { type: GraphQLString }
    },
    resolve: async (_: any, args: any, context: any) => {
      const user = context.user;

      if (user.role !== "client") {
        throw new Error("Only client can release milestone");
      }

      // 1️⃣ fetch milestone
      const [milestone] = await db
        .select()
        .from(escrowMilestones)
        .where(eq(escrowMilestones.id, args.milestoneId));

      if (!milestone || milestone.status === "released") {
        throw new Error("Invalid milestone");
      }

      // 2️⃣ mark milestone released
      await db
        .update(escrowMilestones)
        .set({
          status: "released",
          releasedAt: new Date()
        })
        .where(eq(escrowMilestones.id, milestone.id));

      // 3️⃣ increment escrow released amount
      await db
        .update(escrows)
        .set({
          releasedAmount: sql`${escrows.releasedAmount} + ${milestone.amount}`
        })
        .where(eq(escrows.id, milestone.escrowId));

      // 4️⃣ 🔔 EMIT EVENT (THIS IS THE STEP)
      await emitEvent("milestone.released", {
        escrowId: milestone.escrowId,
        milestoneId: milestone.id,
        amount: milestone.amount
      });

      return "Milestone released successfully";
    }
  }
};
