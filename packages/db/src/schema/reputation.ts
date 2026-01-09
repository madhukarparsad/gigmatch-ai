import {
  pgTable,
  uuid,
  integer,
  timestamp
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const reputation = pgTable("reputation", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull()
    .unique(),

  score: integer("score").notNull().default(100),

  completedJobs: integer("completed_jobs").default(0),
  disputedJobs: integer("disputed_jobs").default(0),

  updatedAt: timestamp("updated_at").defaultNow()
});
