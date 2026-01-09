import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} from "graphql";
import { db } from "@gigmatch/db";
import { auditLogs } from "@gigmatch/db/src/schema/audit_logs";
import { desc, lt } from "drizzle-orm";

const AuditLogType = new GraphQLObjectType({
  name: "AuditLog",
  fields: {
    id: { type: GraphQLString },
    actorId: { type: GraphQLString },
    action: { type: GraphQLString },
    entityType: { type: GraphQLString },
    entityId: { type: GraphQLString },
    metadata: { type: GraphQLString }, // JSON serialized
    createdAt: { type: GraphQLString }
  }
});

const AuditLogConnection = new GraphQLObjectType({
  name: "AuditLogConnection",
  fields: {
    logs: { type: new GraphQLList(AuditLogType) },
    hasMore: { type: GraphQLBoolean }
  }
});

export const AuditQueries = {
  auditLogs: {
    type: AuditLogConnection,
    args: {
      before: { type: GraphQLString }, // cursor (createdAt)
      limit: { type: GraphQLString }
    },
    resolve: async (_: any, args: any, context: any) => {
      const user = context.user;

      // 🔐 Admin only
      if (user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const pageSize = Math.min(Number(args.limit) || 50, 100);

      const rows = await db
        .select()
        .from(auditLogs)
        .where(
          args.before
            ? lt(auditLogs.createdAt, new Date(args.before))
            : undefined
        )
        .orderBy(desc(auditLogs.createdAt))
        .limit(pageSize + 1);

      const hasMore = rows.length > pageSize;
      const logs = hasMore ? rows.slice(0, pageSize) : rows;

      return {
        logs,
        hasMore
      };
    }
  }
};
