importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "{{FIREBASE_API_KEY}}",
  authDomain: "{{FIREBASE_AUTH_DOMAIN}}",
  projectId: "{{FIREBASE_PROJECT_ID}}",
  messagingSenderId: "{{FIREBASE_MESSAGING_SENDER_ID}}",
  appId: "{{FIREBASE_APP_ID}}",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 [SW] Background message received:", payload);

  const notificationTitle = payload.data?.title || "New Notification";

  const notificationOptions = {
    body: payload.data?.body || "",
    icon: "/icons/logo-192x192.png",
    badge: "/badge-72.png",
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  console.log("🎯 [SW] Notification clicked:", event.notification.data);

  event.notification.close();

  const data = event.notification.data;

  if (data.type === "review_batch" && data.batchId) {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          const url = `/review?batchId=${data.batchId}`;

          for (const client of clientList) {
            if (client.url.includes("/review")) {
              return client.focus();
            }
          }

          return clients.openWindow(url);
        })
    );
  } else {
    event.waitUntil(clients.openWindow("/"));
  }
});

self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker activating...");
  event.waitUntil(clients.claim());
});
