import {
  pgTable,
  uuid,
  text,
  timestamp
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const savedSearches = pgTable("saved_searches", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  query: text("query").notNull(),          // raw search text
  filters: text("filters"),                // JSON string (optional)

  createdAt: timestamp("created_at").defaultNow()
});
