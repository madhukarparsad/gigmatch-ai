import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { jobs } from "./jobs";

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),

  jobId: uuid("job_id")
    .references(() => jobs.id)
    .notNull(),

  reviewerId: uuid("reviewer_id")
    .references(() => users.id)
    .notNull(),

  revieweeId: uuid("reviewee_id")
    .references(() => users.id)
    .notNull(),

  rating: integer("rating").notNull(), // 1–5
  comment: text("comment"),

  createdAt: timestamp("created_at").defaultNow()
});
