import {
  pgTable,
  uuid,
  integer,
  text,
  varchar,
  timestamp
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { jobs } from "./jobs";

export const bids = pgTable("bids", {
  id: uuid("id").defaultRandom().primaryKey(),

  jobId: uuid("job_id")
    .references(() => jobs.id)
    .notNull(),

  freelancerId: uuid("freelancer_id")
    .references(() => users.id)
    .notNull(),

  amount: integer("amount").notNull(),
  proposal: text("proposal").notNull(),

  status: varchar("status", { length: 32 }).default("pending"),
  // pending | accepted | rejected

  createdAt: timestamp("created_at").defaultNow()
});
