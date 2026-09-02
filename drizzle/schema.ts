import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  prolineRole: varchar("prolineRole", { length: 32 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  notificationSound: boolean("notificationSound").default(true).notNull(),
});

export const prolineOrders = mysqlTable("prolineOrders", {
  id: int("id").autoincrement().primaryKey(),
  publicId: varchar("publicId", { length: 32 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  priority: mysqlEnum("priority", ["low", "normal", "high", "urgent"]).default("normal").notNull(),
  columnId: mysqlEnum("columnId", ["orders", "production", "polishing", "paint", "warehouse"]).default("orders").notNull(),
  pendingTo: mysqlEnum("pendingTo", ["orders", "production", "polishing", "paint", "warehouse"]),
  rejectedReason: text("rejectedReason"),
  stageEnteredAt: timestamp("stageEnteredAt").defaultNow().notNull(),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const prolineNotifications = mysqlTable("prolineNotifications", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  fromColumn: mysqlEnum("fromColumn", ["orders", "production", "polishing", "paint", "warehouse"]).notNull(),
  toColumn: mysqlEnum("toColumn", ["orders", "production", "polishing", "paint", "warehouse"]).notNull(),
  requesterUserId: int("requesterUserId").notNull(),
  targetRole: varchar("targetRole", { length: 32 }).notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "rejected"]).default("pending").notNull(),
  reason: text("reason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  respondedAt: timestamp("respondedAt"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type ProlineOrder = typeof prolineOrders.$inferSelect;
export type InsertProlineOrder = typeof prolineOrders.$inferInsert;
export type ProlineNotification = typeof prolineNotifications.$inferSelect;
export type InsertProlineNotification = typeof prolineNotifications.$inferInsert;

export const prolineAuditLogs = mysqlTable("prolineAuditLogs", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId"),
  actorUserId: int("actorUserId").notNull(),
  action: varchar("action", { length: 64 }).notNull(),
  fromColumn: mysqlEnum("fromColumn", ["orders", "production", "polishing", "paint", "warehouse"]),
  toColumn: mysqlEnum("toColumn", ["orders", "production", "polishing", "paint", "warehouse"]),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProlineAuditLog = typeof prolineAuditLogs.$inferSelect;
export type InsertProlineAuditLog = typeof prolineAuditLogs.$inferInsert;

export const prolineComments = mysqlTable("prolineComments", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  authorUserId: int("authorUserId").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProlineComment = typeof prolineComments.$inferSelect;
export type InsertProlineComment = typeof prolineComments.$inferInsert;

export const prolinePushSubscriptions = mysqlTable("prolinePushSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  endpoint: varchar("endpoint", { length: 2048 }).notNull().unique(),
  p256dh: varchar("p256dh", { length: 255 }).notNull(),
  auth: varchar("auth", { length: 255 }).notNull(),
  userAgent: varchar("userAgent", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProlinePushSubscription = typeof prolinePushSubscriptions.$inferSelect;
export type InsertProlinePushSubscription = typeof prolinePushSubscriptions.$inferInsert;

/** A single, admin-managed presentation configuration for the PROLINE board. */
export const prolineWorkspaceSettings = mysqlTable("prolineWorkspaceSettings", {
  id: int("id").autoincrement().primaryKey(),
  config: text("config").notNull(),
  updatedByUserId: int("updatedByUserId").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProlineWorkspaceSettings = typeof prolineWorkspaceSettings.$inferSelect;
