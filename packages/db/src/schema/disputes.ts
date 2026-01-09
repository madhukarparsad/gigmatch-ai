import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { jobs } from "./jobs";
import { escrows } from "./escrow";

export const disputes = pgTable("disputes", {
  id: uuid("id").defaultRandom().primaryKey(),

  jobId: uuid("job_id")
    .references(() => jobs.id)
    .notNull(),

  escrowId: uuid("escrow_id")
    .references(() => escrows.id)
    .notNull(),

  raisedBy: uuid("raised_by")
    .references(() => users.id)
    .notNull(),

  reason: text("reason").notNull(),

  status: varchar("status", { length: 32 })
    .default("open"),
  // open | under_review | resolved

  createdAt: timestamp("created_at").defaultNow()
});
