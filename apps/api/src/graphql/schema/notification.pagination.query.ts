import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} from "graphql";
import { db } from "@gigmatch/db";
import { notifications } from "@gigmatch/db/src/schema/notifications";
import { eq, lt, desc } from "drizzle-orm";

const NotificationType = new GraphQLObjectType({
  name: "Notification",
  fields: {
    id: { type: GraphQLString },
    type: { type: GraphQLString },
    payload: { type: GraphQLString },
    isRead: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString }
  }
});

const NotificationEdge = new GraphQLObjectType({
  name: "NotificationEdge",
  fields: {
    cursor: { type: GraphQLString },
    node: { type: NotificationType }
  }
});

const NotificationConnection = new GraphQLObjectType({
  name: "NotificationConnection",
  fields: {
    edges: { type: new GraphQLList(NotificationEdge) },
    hasMore: { type: GraphQLBoolean }
  }
});

export const NotificationPaginationQueries = {
  notificationsPaginated: {
    type: NotificationConnection,
    args: {
      after: { type: GraphQLString }, // cursor (createdAt)
      limit: { type: GraphQLString }  // default handled below
    },
    resolve: async (_: any, args: any, context: any) => {
      const user = context.user;
      const pageSize = Math.min(Number(args.limit) || 20, 50);

      const rows = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, user.userId))
        .where(
          args.after
            ? lt(notifications.createdAt, new Date(args.after))
            : undefined
        )
        .orderBy(desc(notifications.createdAt))
        .limit(pageSize + 1);

      const hasMore = rows.length > pageSize;
      const sliced = hasMore ? rows.slice(0, pageSize) : rows;

      return {
        edges: sliced.map((n) => ({
          cursor: n.createdAt.toISOString(),
          node: n
        })),
        hasMore
      };
    }
  }
};
