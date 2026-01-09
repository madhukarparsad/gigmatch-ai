import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  boolean,
  timestamp
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  type: varchar("type", { length: 64 }).notNull(),

  payload: jsonb("payload").notNull(),

  isRead: boolean("is_read").default(false),

  createdAt: timestamp("created_at").defaultNow()
});
