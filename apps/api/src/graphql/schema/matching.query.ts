import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from "graphql";
import { mongo } from "@gigmatch/db/src/mongo/client";

const MatchType = new GraphQLObjectType({
  name: "Match",
  fields: {
    freelancerId: { type: GraphQLString },
    score: { type: GraphQLInt }
  }
});

export const MatchingQueries = {
  jobMatches: {
    type: new GraphQLList(MatchType),
    args: {
      jobId: { type: GraphQLString }
    },
    resolve: async (_: any, args: any, context: any) => {
      const user = context.user;

      // 🔐 Only client can see matches
      if (user.role !== "client") {
        throw new Error("Unauthorized");
      }

      const doc = await mongo
        .collection("job_matches")
        .findOne({ jobId: args.jobId });

      if (!doc) return [];

      return doc.matches;
    }
  }
};
