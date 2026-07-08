/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** Backend URL: dev/preview Vite proxy, Vercel /api middleware, prod Socket.IO direct connect. */
  readonly VITE_API_URL: string;

  /** Firebase client config — src/lib/firebase.ts */
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;

  /** FCM web push — src/lib/firebase.ts, src/hooks/useFCM.ts */
  readonly VITE_FIREBASE_VAPID_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
