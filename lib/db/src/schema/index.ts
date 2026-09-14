import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export type ProductSpecification = {
  label: string;
  value: string;
};

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  shortDescription: text("short_description").notNull(),
  image: text("image").notNull(),
  eyebrow: varchar("eyebrow", { length: 80 }).notNull(),
  featured: boolean("featured").notNull().default(false),
  description: text("description").notNull(),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  applications: jsonb("applications").$type<string[]>().notNull().default([]),
  specifications: jsonb("specifications")
    .$type<ProductSpecification[]>()
    .notNull()
    .default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const resourcesTable = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  type: varchar("type", { length: 40 }).notNull(),
  actionLabel: varchar("action_label", { length: 80 }).notNull(),
  href: text("href").notNull(),
  productId: integer("product_id").references(() => productsTable.id),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const enquiriesTable = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  productSlug: varchar("product_slug", { length: 180 }),
  name: varchar("name", { length: 160 }).notNull(),
  company: varchar("company", { length: 180 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  requirement: varchar("requirement", { length: 120 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 40 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Product = typeof productsTable.$inferSelect;
export type Resource = typeof resourcesTable.$inferSelect;
export type Enquiry = typeof enquiriesTable.$inferSelect;