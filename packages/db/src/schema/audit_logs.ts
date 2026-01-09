import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  timestamp
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),

  actorId: uuid("actor_id")
    .references(() => users.id),

  action: varchar("action", { length: 128 }).notNull(),
  entityType: varchar("entity_type", { length: 64 }).notNull(),
  entityId: uuid("entity_id"),

  metadata: jsonb("metadata"), // before/after, amounts, etc.

  createdAt: timestamp("created_at").defaultNow()
});
