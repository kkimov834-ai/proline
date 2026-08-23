import webpush from "web-push";
import { ENV } from "./_core/env";
import { deletePushSubscription, listPushSubscriptionsForRole, listPushSubscriptionsForUser } from "./db";

export type ProlinePushPayload = {
  title: string;
  body: string;
  tag?: string;
  url?: string;
  type?: "approval-request" | "approval-result" | "order-created";
  orderId?: number;
};

let vapidConfigured = false;
const columnLabels: Record<string, string> = { orders: "Sifarişlər", production: "İstehsalat", polishing: "Cilalama", paint: "Boyalama", warehouse: "Anbar" };
export function prolineColumnLabel(column: string) { return columnLabels[column] || column; }

function ensureVapidConfigured() {
  if (vapidConfigured) return true;
  if (!ENV.vapidPublicKey || !ENV.vapidPrivateKey || !ENV.vapidSubject) return false;
  webpush.setVapidDetails(ENV.vapidSubject, ENV.vapidPublicKey, ENV.vapidPrivateKey);
  vapidConfigured = true;
  return true;
}

export function isPushConfigured() {
  return Boolean(ENV.vapidPublicKey && ENV.vapidPrivateKey && ENV.vapidSubject);
}

export function getPushPublicKey() {
  return ENV.vapidPublicKey;
}

async function sendToSubscriptions(subscriptions: Array<{ endpoint: string; p256dh: string; auth: string }>, payload: ProlinePushPayload) {
  if (!ensureVapidConfigured()) return { configured: false, sent: 0, removed: 0 };
  let sent = 0;
  let removed = 0;
  await Promise.all(subscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification({ endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } }, JSON.stringify(payload), { TTL: 60 * 60 });
      sent += 1;
    } catch (error: unknown) {
      const statusCode = typeof error === "object" && error !== null && "statusCode" in error ? Number((error as { statusCode?: number }).statusCode) : 0;
      if (statusCode === 404 || statusCode === 410) {
        await deletePushSubscription(subscription.endpoint);
        removed += 1;
        return;
      }
      console.warn("[PROLINE Push] Notification delivery failed:", statusCode || error);
    }
  }));
  return { configured: true, sent, removed };
}

export async function sendPushToRole(targetRole: string, payload: ProlinePushPayload) {
  try {
    return await sendToSubscriptions(await listPushSubscriptionsForRole(targetRole), payload);
  } catch (error) {
    console.warn("[PROLINE Push] Role delivery skipped:", error);
    return { configured: isPushConfigured(), sent: 0, removed: 0 };
  }
}

export async function sendPushToUser(userId: number, payload: ProlinePushPayload) {
  try {
    return await sendToSubscriptions(await listPushSubscriptionsForUser(userId), payload);
  } catch (error) {
    console.warn("[PROLINE Push] User delivery skipped:", error);
    return { configured: isPushConfigured(), sent: 0, removed: 0 };
  }
}
