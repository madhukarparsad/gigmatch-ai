import { GraphQLInt } from "graphql";
import { db } from "@gigmatch/db";
import { notifications } from "@gigmatch/db/src/schema/notifications";
import { eq, and } from "drizzle-orm";

export const NotificationCountQueries = {
  unreadNotificationCount: {
    type: GraphQLInt,
    resolve: async (_: any, __: any, context: any) => {
      const user = context.user;

      const result = await db
        .select({ count: notifications.id })
        .from(notifications)
        .where(and(eq(notifications.userId, user.userId), eq(notifications.isRead, false)));

      return result.length;
    }
  }
};
