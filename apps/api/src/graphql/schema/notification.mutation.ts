import { GraphQLString } from "graphql";
import { db } from "@gigmatch/db";
import { notifications } from "@gigmatch/db/src/schema/notifications";
import { eq, and } from "drizzle-orm";

export const NotificationMutations = {
  markNotificationRead: {
    type: GraphQLString,
    args: {
      notificationId: { type: GraphQLString }
    },
    resolve: async (_: any, args: any, context: any) => {
      const user = context.user;

      await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(notifications.id, args.notificationId),
            eq(notifications.userId, user.userId)
          )
        );

      return "Notification marked as read";
    }
  }
};
