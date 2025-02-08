import { integer, pgTable, varchar, json } from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(0),
});

// Create the schema for wireframe to code table mapping
export const wireframeToCodeTable = pgTable("wireframeToCode", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uid: varchar({ length: 255 }).notNull().unique(), // i want to store whole uid string
  imageUrl: varchar(),
  aiModel: varchar(),
  description: varchar(),
  code: json(),
  createdBy: varchar(),
});
