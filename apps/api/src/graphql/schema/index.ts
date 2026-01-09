import {
  GraphQLSchema,
  GraphQLObjectType
} from "graphql";

import { JobMutations } from "./job.mutation";
import { BidMutations } from "./bid.mutation";
import { EscrowMutations } from "./escrow.mutation";
import { EscrowMilestoneMutations } from "./escrow.milestone.mutation";
import { ReviewMutations } from "./review.mutation";
import { MatchingQueries } from "./matching.query";
import { JobSearchQueries } from "./job.search.query";
import { ProfileSearchQueries } from "./profile.search.query";
import { NotificationQueries } from "./notification.query";
import { NotificationMutations } from "./notification.mutation";
import { NotificationCountQueries } from "./notification.count.query";
import { NotificationBulkMutations } from "./notification.bulk.mutation";
import { NotificationPaginationQueries } from "./notification.pagination.query";
import { AuditQueries } from "./audit.query";
import { DisputeMutations } from "./dispute.mutation";
import { DisputeAdminMutations } from "./dispute.admin.mutation";

// inside RootMutation.fields

// inside RootMutation.fields



const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    _empty: {
      type: GraphQLObjectType
    }
  }
});

const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...JobMutations,
    ...BidMutations,
    ...EscrowMutations,
    ...EscrowMilestoneMutations,
    ...ReviewMutations,
    ...MatchingQueries,
    ...JobSearchQueries,
    ...ProfileSearchQueries,
    ...NotificationQueries,
    ...NotificationMutations,
    ...NotificationCountQueries,
    ...NotificationBulkMutations,
    ...NotificationPaginationQueries,
    ...AuditQueries,
    ...DisputeMutations,
    ...DisputeAdminMutations
    
    
    
    
  }
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});
