import { and, desc, eq, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  prolineAuditLogs,
  prolineComments,
  prolineNotifications,
  prolineOrders,
  prolinePushSubscriptions,
  users,
  type InsertProlineOrder,
  type InsertUser,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required");
  const db = await getDb();
  if (!db) return;
  await db
    .insert(users)
    .values({ ...user, lastSignedIn: user.lastSignedIn || new Date() })
    .onDuplicateKeyUpdate({
      set: {
        name: user.name,
        email: user.email,
        loginMethod: user.loginMethod,
        role: user.role,
        prolineRole: user.prolineRole,
        lastSignedIn: new Date(),
      },
    });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getOrCreateProlineUser(email: string, label: string, prolineRole: string) {
  const openId = `proline:${email}`;
  await upsertUser({ openId, name: label, email, loginMethod: "proline-code", role: prolineRole === "admin" ? "admin" : "user", prolineRole });
  return getUserByOpenId(openId);
}

export async function listBoardData(email: string) {
  const db = await getDb();
  if (!db) return { orders: [], notifications: [], staff: [] };
  const operator = await db.select().from(users).where(eq(users.email, email)).limit(1);
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.email, email));
  const staffRows = await db.select({ email: users.email, name: users.name, prolineRole: users.prolineRole, lastSignedIn: users.lastSignedIn }).from(users);
  const staff = staffRows.map((member) => ({ email: member.email || "", label: member.name || member.email || "Operator", online: Date.now() - new Date(member.lastSignedIn).getTime() < 45000 }));
  const role = operator[0]?.prolineRole || "admin";
  const notifications = role === "admin"
    ? await db.select().from(prolineNotifications).where(or(and(eq(prolineNotifications.requesterUserId, operator[0]?.id || -1), eq(prolineNotifications.status, "pending")), and(eq(prolineNotifications.targetRole, "admin"), eq(prolineNotifications.status, "pending")))).orderBy(desc(prolineNotifications.createdAt))
    : await db.select().from(prolineNotifications).where(and(eq(prolineNotifications.targetRole, role), eq(prolineNotifications.status, "pending"))).orderBy(desc(prolineNotifications.createdAt));
  const orders = await db.select().from(prolineOrders).orderBy(desc(prolineOrders.createdAt));
  return { orders, notifications, staff };
}

export async function insertOrder(order: InsertProlineOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(prolineOrders).values(order);
  const rows = await db.select().from(prolineOrders).where(eq(prolineOrders.publicId, order.publicId)).limit(1);
  return rows[0];
}

export async function addAuditLog(input: { orderId?: number; actorUserId: number; action: string; fromColumn?: "orders" | "production" | "polishing" | "paint" | "warehouse"; toColumn?: "orders" | "production" | "polishing" | "paint" | "warehouse"; details?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(prolineAuditLogs).values({ orderId: input.orderId, actorUserId: input.actorUserId, action: input.action, fromColumn: input.fromColumn, toColumn: input.toColumn, details: input.details });
}

export async function getAuditLogs(orderId?: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(prolineAuditLogs).where(orderId ? eq(prolineAuditLogs.orderId, orderId) : undefined).orderBy(desc(prolineAuditLogs.createdAt));
}

export async function getNotificationPreference(email: string) {
  const db = await getDb();
  if (!db) return true;
  const rows = await db.select({ notificationSound: users.notificationSound }).from(users).where(eq(users.email, email)).limit(1);
  return rows[0]?.notificationSound ?? true;
}

export async function setNotificationPreference(email: string, enabled: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(users).set({ notificationSound: enabled }).where(eq(users.email, email));
  return enabled;
}

export async function exportOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(prolineOrders).orderBy(desc(prolineOrders.createdAt));
}

export async function deleteOrder(orderId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(prolineComments).where(eq(prolineComments.orderId, orderId));
  await db.delete(prolineNotifications).where(eq(prolineNotifications.orderId, orderId));
  await db.delete(prolineAuditLogs).where(eq(prolineAuditLogs.orderId, orderId));
  await db.delete(prolineOrders).where(eq(prolineOrders.id, orderId));
  return { success: true };
}

export async function getComments(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(prolineComments).where(eq(prolineComments.orderId, orderId)).orderBy(desc(prolineComments.createdAt));
  return Promise.all(rows.map(async (comment) => {
    const author = await db.select({ name: users.name, email: users.email }).from(users).where(eq(users.id, comment.authorUserId)).limit(1);
    return { ...comment, authorName: author[0]?.name || author[0]?.email || "İşçi" };
  }));
}

export async function addComment(input: { orderId: number; authorUserId: number; body: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(prolineComments).values(input);
  const rows = await db.select().from(prolineComments).where(and(eq(prolineComments.orderId, input.orderId), eq(prolineComments.authorUserId, input.authorUserId), eq(prolineComments.body, input.body))).orderBy(desc(prolineComments.createdAt)).limit(1);
  return rows[0];
}

export type PushSubscriptionInput = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userAgent?: string;
};

export async function savePushSubscription(userId: number, subscription: PushSubscriptionInput) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(prolinePushSubscriptions).values({
    userId,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
    userAgent: subscription.userAgent || null,
  }).onDuplicateKeyUpdate({
    set: {
      userId,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userAgent: subscription.userAgent || null,
      updatedAt: new Date(),
    },
  });
  return { success: true };
}

export async function deletePushSubscription(endpoint: string) {
  const db = await getDb();
  if (!db) return { success: true };
  await db.delete(prolinePushSubscriptions).where(eq(prolinePushSubscriptions.endpoint, endpoint));
  return { success: true };
}

export async function listPushSubscriptionsForRole(targetRole: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: prolinePushSubscriptions.id, userId: prolinePushSubscriptions.userId, endpoint: prolinePushSubscriptions.endpoint, p256dh: prolinePushSubscriptions.p256dh, auth: prolinePushSubscriptions.auth })
    .from(prolinePushSubscriptions)
    .innerJoin(users, eq(users.id, prolinePushSubscriptions.userId))
    .where(eq(users.prolineRole, targetRole));
}

export async function listPushSubscriptionsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(prolinePushSubscriptions).where(eq(prolinePushSubscriptions.userId, userId));
}
