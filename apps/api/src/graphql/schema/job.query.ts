import { GraphQLString } from "graphql";
import { listJobs } from "../../clients/jobService.client";

export const JobQueries = {
  jobs: {
    type: GraphQLString,
    resolve: async () => {
      return listJobs();
    }
  }
};
