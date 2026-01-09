import { GraphQLString } from "graphql";
import { db } from "@gigmatch/db";
import { disputes } from "@gigmatch/db/src/schema/disputes";

export const DisputeMutations = {
  raiseDispute: {
    type: GraphQLString,
    args: {
      jobId: { type: GraphQLString },
      escrowId: { type: GraphQLString },
      reason: { type: GraphQLString }
    },
    resolve: async (_: any, args: any, context: any) => {
      const user = context.user;

      await db.insert(disputes).values({
        jobId: args.jobId,
        escrowId: args.escrowId,
        raisedBy: user.userId,
        reason: args.reason
      });

      return "Dispute raised successfully";
    }
  }
};
