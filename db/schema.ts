import {
  mysqlTable,
  serial,
  varchar,
  text,
  int,
  decimal,
  timestamp,
  json,
} from "drizzle-orm/mysql-core";

// ─── Customers ───
export const customers = mysqlTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ─── Orders ───
export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull(),
  customerId: int("customer_id"),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  items: json("items").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  payment: varchar("payment", { length: 50 }).notNull().default("cash"),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ─── Reviews ───
export const reviews = mysqlTable("reviews", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  rating: int("rating").notNull(),
  text: text("text").notNull(),
  date: varchar("date", { length: 100 }).notNull(),
  orderType: varchar("order_type", { length: 100 }),
  source: varchar("source", { length: 50 }).notNull().default("manual"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Menu Items (for sync from frontend data) ───
export const menuItemsDb = mysqlTable("menu_items", {
  id: serial("id").primaryKey(),
  itemId: varchar("item_id", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  priceLarge: decimal("price_large", { precision: 10, scale: 2 }),
  calories: int("calories"),
  caloriesLarge: int("calories_large"),
  category: varchar("category", { length: 50 }).notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  isHot: int("is_hot").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});
