import {
  pgTable,
  serial,
  integer,
  numeric,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

// 1. Diamond Packages
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  diamonds: integer("diamonds").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  bonus: integer("bonus").default(0).notNull(),
  label: text("label"),
  imageUrl: text("image_url"), // Admin panel එකෙන් පින්තූර දාන්න
  isActive: boolean("is_active").default(true).notNull(),
  isPopular: boolean("is_popular").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Memberships (NEW)
export const memberships = pgTable("memberships", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Weekly / Monthly
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  diamondsTotal: integer("diamonds_total").notNull(),
  label: text("label"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Payment Methods (UPDATED)
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  instructions: text("instructions"),
  accountDetails: text("account_details"), // ගිණුම් අංක/දුරකථන අංක පෙන්වන්න
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Orders (UPDATED)
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderRef: text("order_ref").notNull().unique(),
  playerId: text("player_id").notNull(),
  orderType: text("order_type").default('package').notNull(), // 'package' or 'membership'
  itemId: integer("item_id").notNull(), // packageId or membershipId
  itemName: text("item_name").notNull(), // e.g. "115 Diamonds" or "Weekly Membership"
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  receiptUrl: text("receipt_url"), // Customer දාන slip එකේ ෆොටෝ එක
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 5. Special Offers (NEW)
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  discountPercent: integer("discount_percent"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});