import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLFloat
} from "graphql";
import { rankFreelancers } from "../../ai/matchRanker";
import { getMatchSignals } from "../../services/matchData.service";

const RankedMatchType = new GraphQLObjectType({
  name: "RankedMatch",
  fields: {
    freelancerId: { type: GraphQLString },
    score: { type: GraphQLFloat }
  }
});

export const MatchQueries = {
  rankedMatchesByJob: {
    type: new GraphQLList(RankedMatchType),
    args: {
      jobId: { type: GraphQLString }
    },
    resolve: async (_: any, args: any) => {
      const signals = await getMatchSignals(args.jobId);

      return signals
        .map(s => ({
          freelancerId: s.freelancerId,
          score: rankFreelancers({
            reputation: s.reputation,
            bidAmount: s.bidAmount,
            skillMatchScore: 0.8 // placeholder (next phase)
          })
        }))
        .sort((a, b) => b.score - a.score);
    }
  }
};
