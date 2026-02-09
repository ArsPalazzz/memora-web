// "use client";

// import { useFCM } from "@/hooks/useFCM";

// import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";

// export function FCMInitializer() {
//   const [isMounted, setIsMounted] = useState(false);
//   const [isIOS, setIsIOS] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);

//     // Проверяем iOS
//     if (typeof navigator !== "undefined") {
//       const userAgent = navigator.userAgent.toLowerCase();
//       setIsIOS(/iphone|ipad|ipod/.test(userAgent));
//     }
//   }, []);

//   useEffect(() => {
//     if (!isMounted || isIOS) return;

//     // Динамически импортируем хук только на клиенте
//     const initFCM = async () => {
//       try {
//         const { useFCM } = await import("@/hooks/useFCM");
//         // Просто импортируем, хук сам отработает
//       } catch (error) {
//         console.error("FCM initialization error:", error);
//       }
//     };

//     initFCM();
//   }, [isMounted, isIOS]);

//   // На сервере и iOS ничего не рендерим
//   return null;
// }

"use client";

import { useEffect, useState } from "react";
import { useFCM } from "@/hooks/useFCM";

// Компонент-обертка для условного использования FCM
function FCMComponent() {
  // Хук будет вызван только на клиенте
  useFCM();

  // Этот компонент ничего не рендерит
  return null;
}

export function FCMInitializer() {
  const [isMounted, setIsMounted] = useState(false);
  const [shouldLoadFCM, setShouldLoadFCM] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Проверяем, нужно ли загружать FCM
    if (typeof navigator !== "undefined") {
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);

      // Загружаем FCM только на не-iOS устройствах
      if (!isIOS) {
        setShouldLoadFCM(true);
      }
    }
  }, []);

  // На сервере ничего не рендерим
  if (!isMounted) return null;

  // На iOS ничего не рендерим
  if (!shouldLoadFCM) return null;

  // Динамически загружаем компонент с FCM
  return <FCMComponent />;
}
