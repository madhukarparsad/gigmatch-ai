import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLFloat
} from "graphql";
import { getRecommendedJobs } from "../../services/reverseMatch.service";

const RecommendedJobType = new GraphQLObjectType({
  name: "RecommendedJob",
  fields: {
    jobId: { type: GraphQLString },
    title: { type: GraphQLString },
    score: { type: GraphQLFloat }
  }
});

export const ReverseMatchQueries = {
  recommendedJobsForFreelancer: {
    type: new GraphQLList(RecommendedJobType),
    resolve: async (_: any, __: any, context: any) => {
      const user = context.user;

      if (user.role !== "freelancer") {
        throw new Error("Only freelancers can access this");
      }

      return getRecommendedJobs(
        user.userId,
        user.skills // from profile
      );
    }
  }
};
