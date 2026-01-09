// // import { GraphQLString, GraphQLInt } from "graphql";
// // import { bids } from "@gigmatch/db/src/schema/bids";
// // import { db } from "@gigmatch/db";

// // export const BidMutations = {
// //   placeBid: {
// //     type: GraphQLString,
// //     args: {
// //       jobId: { type: GraphQLString },
// //       amount: { type: GraphQLInt },
// //       proposal: { type: GraphQLString }
// //     },
// //     resolve: async (_: any, args: any, context: any) => {
// //       const user = context.user;

// //       if (user.role !== "freelancer") {
// //         throw new Error("Only freelancers can place bids");
// //       }

// //       await db.insert(bids).values({
// //         jobId: args.jobId,
// //         freelancerId: user.userId,
// //         amount: args.amount,
// //         proposal: args.proposal
// //       });

// //       return "Bid placed successfully";
// //     }
// //   }
// // };


// import { GraphQLString, GraphQLInt } from "graphql";
// import { bids } from "@gigmatch/db/src/schema/bids";
// import { jobs } from "@gigmatch/db/src/schema/jobs";
// import { db } from "@gigmatch/db";
// import { emitEvent } from "@gigmatch/utils/src/kafka";
// import { eq } from "drizzle-orm";

// export const BidMutations = {
//   placeBid: {
//     type: GraphQLString,
//     args: {
//       jobId: { type: GraphQLString },
//       amount: { type: GraphQLInt },
//       proposal: { type: GraphQLString }
//     },
//     resolve: async (_: any, args: any, context: any) => {
//       const user = context.user;

//       if (user.role !== "freelancer") {
//         throw new Error("Only freelancers can place bids");
//       }

//       // 1️⃣ create bid
//       const [bid] = await db
//         .insert(bids)
//         .values({
//           jobId: args.jobId,
//           freelancerId: user.userId,
//           amount: args.amount,
//           proposal: args.proposal
//         })
//         .returning();

//       // 2️⃣ find client (job owner)
//       const [job] = await db
//         .select()
//         .from(jobs)
//         .where(eq(jobs.id, args.jobId));

//       // 3️⃣ emit event
//       await emitEvent("bid.placed", {
//         bidId: bid.id,
//         jobId: bid.jobId,
//         clientId: job.clientId,
//         freelancerId: user.userId,
//         amount: bid.amount
//       });

//       return "Bid placed successfully";
//     }
//   }
// };


import { GraphQLString, GraphQLInt } from "graphql";
import { placeBid } from "../../clients/bidService.client";

export const BidMutations = {
  placeBid: {
    type: GraphQLString,
    args: {
      jobId: { type: GraphQLString },
      amount: { type: GraphQLInt }
    },
    resolve: async (_: any, args: any, context: any) => {
      const user = context.user;

      // 🔐 Only freelancers can bid
      if (user.role !== "freelancer") {
        throw new Error("Only freelancers can place bids");
      }

      await placeBid({
        jobId: args.jobId,
        freelancerId: user.userId,
        amount: args.amount
      });

      return "Bid placed successfully";
    }
  }
};
