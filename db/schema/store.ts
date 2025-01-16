import { date, pgTable, serial, text } from "drizzle-orm/pg-core";

export const Store = pgTable("store", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("userId").notNull(),
  createdAt: date("createdAt").notNull().defaultNow(),
  updatedAt: date("updatedAt").notNull().defaultNow(),
});

export type StoreType = typeof Store.$inferSelect;
