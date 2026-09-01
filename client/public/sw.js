/* PROLINE Web Push service worker. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: "PROLINE", body: event.data?.text() || "Yeni bildiriş var." };
  }

  const title = payload.title || "PROLINE";
  const options = {
    body: payload.body || "PROLINE panelində yeni məlumat var.",
    icon: "/assets/proline-logo.png",
    badge: "/assets/proline-logo.png",
    tag: payload.tag || "proline-notification",
    renotify: true,
    requireInteraction: false,
    silent: false,
    data: { url: payload.url || "/", orderId: payload.orderId, type: payload.type },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || "/", self.location.origin).href;
  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clients) {
      if ("focus" in client) {
        await client.focus();
        if ("navigate" in client) await client.navigate(targetUrl);
        return;
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(targetUrl);
  })());
});
