// import {
//   GraphQLObjectType,
//   GraphQLString,
//   GraphQLInt
// } from "graphql";

// export const BidType = new GraphQLObjectType({
//   name: "Bid",
//   fields: {
//     id: { type: GraphQLString },
//     jobId: { type: GraphQLString },
//     freelancerId: { type: GraphQLString },
//     amount: { type: GraphQLInt },
//     proposal: { type: GraphQLString },
//     status: { type: GraphQLString }
//   }
// });


import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt
} from "graphql";
import { listBids } from "../../clients/bidService.client";

const BidType = new GraphQLObjectType({
  name: "Bid",
  fields: {
    id: { type: GraphQLString },
    jobId: { type: GraphQLString },
    freelancerId: { type: GraphQLString },
    amount: { type: GraphQLInt }
  }
});

export const BidQueries = {
  bidsByJob: {
    type: new GraphQLList(BidType),
    args: {
      jobId: { type: GraphQLString }
    },
    resolve: async (_: any, args: any) => {
      return listBids(args.jobId);
    }
  }
};
