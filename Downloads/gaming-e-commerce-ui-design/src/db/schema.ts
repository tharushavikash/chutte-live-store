import {
  pgTable,
  serial,
  integer,
  numeric,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  diamonds: integer("diamonds").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  bonus: integer("bonus").default(0).notNull(),
  label: text("label"),
  isActive: boolean("is_active").default(true).notNull(),
  isPopular: boolean("is_popular").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // bank | payhere | visa | mastercard | ezcash
  instructions: text("instructions"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderRef: text("order_ref").notNull().unique(),
  playerId: text("player_id").notNull(),
  packageId: integer("package_id").references(() => packages.id),
  diamonds: integer("diamonds").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  status: text("status").default("pending").notNull(), // pending | processing | completed | cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PackageRow = typeof packages.$inferSelect;
export type PaymentMethodRow = typeof paymentMethods.$inferSelect;
export type OrderRow = typeof orders.$inferSelect;
