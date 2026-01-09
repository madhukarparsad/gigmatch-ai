import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from "graphql";
import { mongo } from "@gigmatch/db/src/mongo/client";

const ProfileSearchType = new GraphQLObjectType({
  name: "ProfileSearch",
  fields: {
    userId: { type: GraphQLString },
    title: { type: GraphQLString },
    skills: { type: new GraphQLList(GraphQLString) }
  }
});

export const ProfileSearchQueries = {
  searchFreelancers: {
    type: new GraphQLList(ProfileSearchType),
    args: {
      query: { type: GraphQLString }
    },
    resolve: async (_: any, args: any) => {
      return mongo
        .collection("profiles")
        .find({ $text: { $search: args.query } })
        .limit(20)
        .toArray();
    }
  }
};
