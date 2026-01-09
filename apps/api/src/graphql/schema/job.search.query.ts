import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from "graphql";
import { db } from "@gigmatch/db";
import { jobs } from "@gigmatch/db/src/schema/jobs";
import { sql } from "drizzle-orm";

const JobSearchType = new GraphQLObjectType({
  name: "JobSearch",
  fields: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString }
  }
});

export const JobSearchQueries = {
  searchJobs: {
    type: new GraphQLList(JobSearchType),
    args: {
      query: { type: GraphQLString }
    },
    resolve: async (_: any, args: any) => {
      const q = args.query;

      return db.execute(sql`
        SELECT id, title, description
        FROM jobs
        WHERE to_tsvector('english', title || ' ' || description)
        @@ plainto_tsquery('english', ${q})
        ORDER BY ts_rank(
          to_tsvector('english', title || ' ' || description),
          plainto_tsquery('english', ${q})
        ) DESC
        LIMIT 20;
      `);
    }
  }
};
