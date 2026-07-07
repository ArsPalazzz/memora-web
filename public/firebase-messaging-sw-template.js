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

  const title = payload.data?.title ?? "New Notification";
  const body = payload.data?.body ?? "";

  const notificationOptions = {
    body,
    icon: "/icons/logo-192x192.png",
    badge: "/icons/logo-192x192.png",
    data: payload.data || {},
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
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
  } else if (data.type === "league") {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          const url = "/friends/league";

          for (const client of clientList) {
            if (client.url.includes("/friends/league")) {
              return client.focus();
            }
          }

          return clients.openWindow(url);
        })
    );
  } else if (data.type === "challenge") {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          const url = "/home";

          for (const client of clientList) {
            if (client.url.includes("/home")) {
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
