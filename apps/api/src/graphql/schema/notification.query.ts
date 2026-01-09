import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} from "graphql";
import { db } from "@gigmatch/db";
import { notifications } from "@gigmatch/db/src/schema/notifications";
import { eq, desc } from "drizzle-orm";

const NotificationType = new GraphQLObjectType({
  name: "Notification",
  fields: {
    id: { type: GraphQLString },
    type: { type: GraphQLString },
    payload: { type: GraphQLString }, // JSON serialized
    isRead: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString }
  }
});

export const NotificationQueries = {
  notifications: {
    type: new GraphQLList(NotificationType),
    resolve: async (_: any, __: any, context: any) => {
      const user = context.user;

      return db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, user.userId))
        .orderBy(desc(notifications.createdAt));
    }
  }
};
