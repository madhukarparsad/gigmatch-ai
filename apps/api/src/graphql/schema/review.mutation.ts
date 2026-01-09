// import { GraphQLString, GraphQLInt } from "graphql";
// import { db } from "@gigmatch/db";
// import { reviews } from "@gigmatch/db/src/schema/reviews";
// import { escrows } from "@gigmatch/db/src/schema/escrow";
// import { eq } from "drizzle-orm";

// export const ReviewMutations = {
//   submitReview: {
//     type: GraphQLString,
//     args: {
//       escrowId: { type: GraphQLString },
//       rating: { type: GraphQLInt },
//       comment: { type: GraphQLString }
//     },
//     resolve: async (_: any, args: any, context: any) => {
//       const user = context.user;

//       // 1️⃣ Fetch escrow
//       const [escrow] = await db
//         .select()
//         .from(escrows)
//         .where(eq(escrows.id, args.escrowId));

//       if (!escrow || escrow.status !== "completed") {
//         throw new Error("Escrow not completed");
//       }

//       // 2️⃣ Determine reviewee
//       const revieweeId =
//         user.userId === escrow.clientId
//           ? escrow.freelancerId
//           : escrow.clientId;

//       // 3️⃣ Insert review
//       await db.insert(reviews).values({
//         jobId: escrow.jobId,
//         reviewerId: user.userId,
//         revieweeId,
//         rating: args.rating,
//         comment: args.comment
//       });

//       return "Review submitted successfully";
//     }
//   }
// };




import { GraphQLString, GraphQLInt } from "graphql";
import { db } from "@gigmatch/db";
import { reviews } from "@gigmatch/db/src/schema/reviews";
import { eq, and } from "drizzle-orm";

export const ReviewMutations = {
  submitReview: {
    type: GraphQLString,
    args: {
      jobId: { type: GraphQLString },
      revieweeId: { type: GraphQLString },
      rating: { type: GraphQLInt },
      comment: { type: GraphQLString }
    },
    resolve: async (_: any, args: any, context: any) => {
      const user = context.user;

      if (args.rating < 1 || args.rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      // 🛑 Prevent duplicate reviews
      const existing = await db
        .select()
        .from(reviews)
        .where(
          and(
            eq(reviews.jobId, args.jobId),
            eq(reviews.reviewerId, user.userId)
          )
        );

      if (existing.length > 0) {
        throw new Error("Review already submitted");
      }

      await db.insert(reviews).values({
        jobId: args.jobId,
        reviewerId: user.userId,
        revieweeId: args.revieweeId,
        rating: args.rating,
        comment: args.comment
      });

      return "Review submitted successfully";
    }
  }
};
