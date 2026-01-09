import { GraphQLString } from "graphql";
import { db } from "@gigmatch/db";
import { disputes } from "@gigmatch/db/src/schema/disputes";
import { escrows } from "@gigmatch/db/src/schema/escrows";
import { eq } from "drizzle-orm";

export const DisputeAdminMutations = {
  resolveDispute: {
    type: GraphQLString,
    args: {
      disputeId: { type: GraphQLString },
      action: { type: GraphQLString } 
      // release | refund | reject
    },
    resolve: async (_: any, args: any, context: any) => {
      const user = context.user;

      if (user.role !== "admin") {
        throw new Error("Only admin can resolve disputes");
      }

      // Fetch dispute
      const [dispute] = await db
        .select()
        .from(disputes)
        .where(eq(disputes.id, args.disputeId));

      if (!dispute) {
        throw new Error("Dispute not found");
      }

      // Update dispute status
      await db
        .update(disputes)
        .set({
          status: "resolved"
        })
        .where(eq(disputes.id, args.disputeId));

      // Update escrow state (decision recorded)
      await db
        .update(escrows)
        .set({
          status: args.action // release | refund | rejected
        })
        .where(eq(escrows.id, dispute.escrowId));

      return "Dispute resolved successfully";
    }
  }
};
