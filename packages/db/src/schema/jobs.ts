import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  timestamp
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),

  clientId: uuid("client_id")
    .references(() => users.id)
    .notNull(),

  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),

  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),

  status: varchar("status", { length: 32 }).default("open"),
  // open | hired | closed

  createdAt: timestamp("created_at").defaultNow()
});
