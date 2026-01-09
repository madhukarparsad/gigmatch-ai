// import { GraphQLString, GraphQLInt } from "graphql";
// import { jobs } from "@gigmatch/db/src/schema/jobs";
// import { db } from "@gigmatch/db";

// export const JobMutations = {
//   createJob: {
//     type: GraphQLString,
//     args: {
//       title: { type: GraphQLString },
//       description: { type: GraphQLString },
//       budgetMin: { type: GraphQLInt },
//       budgetMax: { type: GraphQLInt }
//     },
//     resolve: async (_: any, args: any, context: any) => {
//       const user = context.user;

//       if (user.role !== "client") {
//         throw new Error("Only clients can create jobs");
//       }

//       await db.insert(jobs).values({
//         clientId: user.userId,
//         title: args.title,
//         description: args.description,
//         budgetMin: args.budgetMin,
//         budgetMax: args.budgetMax
//       });

//       return "Job created successfully";
//     }
//   }
// };

import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt
} from "graphql";
import { listJobs } from "../../clients/jobService.client";

const JobType = new GraphQLObjectType({
  name: "Job",
  fields: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    budgetMin: { type: GraphQLInt },
    budgetMax: { type: GraphQLInt },
    status: { type: GraphQLString }
  }
});

export const JobQueries = {
  jobs: {
    type: new GraphQLList(JobType),
    resolve: async () => {
      return listJobs();
    }
  }
};
