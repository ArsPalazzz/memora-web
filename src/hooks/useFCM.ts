
import { useState, useEffect, useCallback } from "react";
import { firebaseConfig, vapidKey } from "@/lib/firebase";
import { useAuthContext } from "@/context/AuthContext";
import { useAuth } from "@/utils/auth";

export const useFCM = () => {
  const { authenticated } = useAuth();
  const { accessToken } = useAuthContext();
  const [token, setToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [swRegistration, setSwRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  const [isClient, setIsClient] = useState(false);

  // Устанавливаем флаг после монтирования на клиенте
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const supported =
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      firebaseConfig.apiKey;

    setIsSupported(!!supported);
    setPermission(Notification.permission);
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !isSupported) return;

    const registerSW = async () => {
      try {
        if (import.meta.env.DEV) {
          // Dev: PWA SW disabled — register FCM handlers directly (same as before Next migration)
          const reg = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            { scope: "/" },
          );
          console.log("✅ FCM Service Worker registered (dev)");
          setSwRegistration(reg);
          return;
        }

        // Prod: unified SW (Workbox + FCM via importScripts) registered by vite-plugin-pwa
        const reg = await navigator.serviceWorker.ready;
        console.log("✅ PWA Service Worker ready (prod)");
        setSwRegistration(reg);
      } catch (err) {
        console.error("❌ Service Worker registration failed:", err);
      }
    };

    registerSW();
  }, [isClient, isSupported]);

  const sendTokenToBackend = useCallback(
    async (fcmToken: string) => {
      if (!accessToken) return;

      try {
        await fetch("/api/notifications/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            token: fcmToken,
            deviceInfo: {
              userAgent: navigator.userAgent,
              platform: navigator.platform,
            },
          }),
        });
        console.log("✅ Token sent to backend");
      } catch (error) {
        console.error("❌ Failed to send token:", error);
      }
    },
    [accessToken]
  );

  const getFCMToken = useCallback(async (): Promise<string | null> => {
    if (!isSupported || !swRegistration || permission !== "granted") {
      return null;
    }

    try {
      const { initializeApp } = await import("firebase/app");
      const { getMessaging, getToken } = await import("firebase/messaging");

      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      const fcmToken = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: swRegistration,
      });

      if (fcmToken) {
        setToken(fcmToken);
        await sendTokenToBackend(fcmToken);
        return fcmToken;
      }

      return null;
    } catch (error) {
      console.error("❌ Error getting FCM token:", error);
      return null;
    }
  }, [isSupported, swRegistration, permission, sendTokenToBackend]);

  useEffect(() => {
    if (!authenticated || !isSupported) return;

    const initFCM = async () => {
      if (permission === "default") {
        console.log(
          "Notification permission is default - waiting for user action"
        );
        return;
      }

      if (permission === "granted") {
        await getFCMToken();
      }
    };

    initFCM();
  }, [authenticated, isSupported, permission, getFCMToken]);

  const enableNotifications = useCallback(async () => {
    if (!isSupported) {
      return {
        success: false,
        message: "Browser doesn't support notifications",
      };
    }

    setIsLoading(true);
    try {
      const newPermission = await Notification.requestPermission();
      setPermission(newPermission);

      if (newPermission === "granted") {
        const newToken = await getFCMToken();
        return {
          success: !!newToken,
          message: newToken ? "Notifications enabled!" : "Failed to get token",
        };
      } else if (newPermission === "denied") {
        return {
          success: false,
          message: "Notifications blocked. Please enable in browser settings",
        };
      } else {
        return {
          success: false,
          message: "Notification permission not granted",
        };
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      return {
        success: false,
        message: "Error enabling notifications",
      };
    } finally {
      setIsLoading(false);
      setShowCustomPrompt(false);
    }
  }, [isSupported, getFCMToken]);

  const disableNotifications = useCallback(async () => {
    if (!token) return { success: false, message: "No token to delete" };

    setIsLoading(true);
    try {
      const { initializeApp } = await import("firebase/app");
      const { getMessaging, deleteToken } = await import("firebase/messaging");

      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      await deleteToken(messaging);
      setToken(null);

      if (accessToken) {
        await fetch("/api/notifications/unsubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ token }),
        });
      }

      return { success: true, message: "Notifications disabled" };
    } catch (error) {
      console.error("Error disabling notifications:", error);
      return { success: false, message: "Error disabling notifications" };
    } finally {
      setIsLoading(false);
    }
  }, [token, accessToken]);

  const showNotificationPrompt = useCallback(() => {
    if (permission === "default") {
      setShowCustomPrompt(true);
    } else if (permission === "granted") {
      return;
    } else {
      setShowCustomPrompt(true);
    }
  }, [permission]);

  return {
    token,
    isSupported,
    permission,
    isLoading,
    showCustomPrompt,
    setShowCustomPrompt,
    enableNotifications,
    disableNotifications,
    showNotificationPrompt,
  };
};
