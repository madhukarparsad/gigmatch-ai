import { GraphQLString } from "graphql";
import { db } from "@gigmatch/db";
import { notifications } from "@gigmatch/db/src/schema/notifications";
import { eq, and } from "drizzle-orm";

export const NotificationBulkMutations = {
  markAllNotificationsRead: {
    type: GraphQLString,
    resolve: async (_: any, __: any, context: any) => {
      const user = context.user;

      await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(notifications.userId, user.userId),
            eq(notifications.isRead, false)
          )
        );

      return "All notifications marked as read";
    }
  }
};
