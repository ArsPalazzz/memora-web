# PWA + Firebase Cloud Messaging

## Architecture (single service worker in production)

Next.js used two service workers (`next-pwa` + `firebase-messaging-sw.js`), which conflict on scope `/`.

**Vite solution:**

| Environment | Service worker | FCM |
|-------------|----------------|-----|
| **Production** | `/sw.js` (Workbox precache + auto-update) | `importScripts('/firebase-messaging-sw.js')` inside `sw.js` |
| **Development** | `/firebase-messaging-sw.js` only (PWA disabled, same as old Next dev) | direct registration with `Service-Worker-Allowed: /` |

### Build pipeline

```
npm run build
  1. node scripts/generate-sw.js   → public/firebase-messaging-sw.js
  2. vite build                    → dist/sw.js (injectManifest + FCM chunk)
  3. registerSW.js               → auto-registers /sw.js
```

### Client (`src/hooks/useFCM.ts`)

- **Dev:** registers `/firebase-messaging-sw.js`
- **Prod:** waits for `navigator.serviceWorker.ready` (PWA SW)
- Gets FCM token → `POST /api/notifications/subscribe`

### nginx headers

See `deploy/nginx.conf`:

- `/sw.js` — unified PWA + FCM entry
- `/firebase-messaging-sw.js` — static chunk for `importScripts` (must not be cached long-term)

### Install criteria (Chrome)

- HTTPS (or localhost)
- `manifest.webmanifest` with required fields
- Registered SW with fetch handler (`sw.js`)

### Push test checklist

1. `npm run preview` + `memora-api` running
2. Login → Profile → enable notifications
3. Check Network: `POST /api/notifications/subscribe` → 200
4. DevTools → Application → Service Workers: one active SW (`sw.js` in prod)
