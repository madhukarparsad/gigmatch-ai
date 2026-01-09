import {
  pgTable,
  uuid,
  integer,
  varchar,
  timestamp
} from "drizzle-orm/pg-core";
import { jobs } from "./jobs";
import { users } from "./users";

export const escrows = pgTable("escrows", {
  id: uuid("id").defaultRandom().primaryKey(),

  jobId: uuid("job_id")
    .references(() => jobs.id)
    .notNull(),

  clientId: uuid("client_id")
    .references(() => users.id)
    .notNull(),

  freelancerId: uuid("freelancer_id")
    .references(() => users.id)
    .notNull(),

  totalAmount: integer("total_amount").notNull(),
  releasedAmount: integer("released_amount").default(0),

  status: varchar("status", { length: 32 }).default("locked"),
  // locked | partially_released | completed | disputed

  createdAt: timestamp("created_at").defaultNow()
});
