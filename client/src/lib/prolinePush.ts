export type ProlinePushSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export async function registerProlineServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) throw new Error("Bu brauzer service worker-i dəstəkləmir.");
  return navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

export async function getProlinePushSubscription(publicKey: string) {
  if (!("PushManager" in window)) throw new Error("Bu brauzer push bildirişlərini dəstəkləmir.");
  const registration = await registerProlineServiceWorker();
  const existing = await registration.pushManager.getSubscription();
  if (existing) return existing;
  const applicationServerKey = urlBase64ToUint8Array(publicKey);
  return registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });
}

export async function removeProlinePushSubscription() {
  if (!("serviceWorker" in navigator)) return false;
  const registration = await navigator.serviceWorker.getRegistration("/");
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return true;
  await subscription.unsubscribe();
  return true;
}

export function serializeProlinePushSubscription(subscription: PushSubscription): ProlinePushSubscription {
  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth) throw new Error("Push subscription məlumatı natamamdır.");
  return { endpoint: json.endpoint, keys: { p256dh: json.keys.p256dh, auth: json.keys.auth } };
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replaceAll("-", "+").replaceAll("_", "/");
  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let index = 0; index < rawData.length; index += 1) output[index] = rawData.charCodeAt(index);
  return output;
}
