import {
  pgTable,
  uuid,
  integer,
  varchar,
  timestamp
} from "drizzle-orm/pg-core";
import { escrows } from "./escrow";

export const escrowMilestones = pgTable("escrow_milestones", {
  id: uuid("id").defaultRandom().primaryKey(),

  escrowId: uuid("escrow_id")
    .references(() => escrows.id)
    .notNull(),

  title: varchar("title", { length: 255 }).notNull(),

  amount: integer("amount").notNull(),

  status: varchar("status", { length: 32 }).default("pending"),
  // pending | released

  createdAt: timestamp("created_at").defaultNow(),
  releasedAt: timestamp("released_at")
});
