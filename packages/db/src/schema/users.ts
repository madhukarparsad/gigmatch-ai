import {
  pgTable,
  uuid,
  varchar,
  timestamp
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),

  role: varchar("role", { length: 32 }).notNull(),
  // client | freelancer | admin

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
