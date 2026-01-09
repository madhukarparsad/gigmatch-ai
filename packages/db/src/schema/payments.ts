import {
  pgTable,
  uuid,
  integer,
  varchar,
  timestamp
} from "drizzle-orm/pg-core";

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),

  milestoneId: uuid("milestone_id").notNull(),
  escrowId: uuid("escrow_id").notNull(),

  amount: integer("amount").notNull(),

  status: varchar("status", { length: 32 }).default("completed"),
  // pending | completed | failed

  createdAt: timestamp("created_at").defaultNow()
});
