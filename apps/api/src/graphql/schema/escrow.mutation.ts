import { GraphQLString } from "graphql";
import { escrows } from "@gigmatch/db/src/schema/escrow";
import { bids } from "@gigmatch/db/src/schema/bids";
import { db } from "@gigmatch/db";
import { eq } from "drizzle-orm";
import { emitEvent } from "@gigmatch/utils/src/kafka";

export const EscrowMutations = {
  acceptBid: {
    type: GraphQLString,
    args: {
      bidId: { type: GraphQLString }
    },
    resolve: async (_: any, args: any, context: any) => {
      const user = context.user;

      if (user.role !== "client") {
        throw new Error("Only clients can accept bids");
      }

      // 1️⃣ Fetch bid
      const [bid] = await db
        .select()
        .from(bids)
        .where(eq(bids.id, args.bidId));

      if (!bid) {
        throw new Error("Bid not found");
      }

      // 2️⃣ Create escrow
      await db.insert(escrows).values({
        jobId: bid.jobId,
        clientId: user.userId,
        freelancerId: bid.freelancerId,
        totalAmount: bid.amount
      });

      // 3️⃣ Update bid status
      await db
        .update(bids)
        .set({ status: "accepted" })
        .where(eq(bids.id, bid.id));

      // 4️⃣ Emit event (future realtime / AI)
      await emitEvent("escrow.created", {
        jobId: bid.jobId,
        clientId: user.userId,
        freelancerId: bid.freelancerId,
        amount: bid.amount
      });

      return "Escrow created successfully";
    }
  }
};
