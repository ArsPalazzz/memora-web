"use client";

import { useEffect, useState } from "react";

export default function OrientationLock({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window === "undefined") return;

      // Используем screen.orientation, если доступно
      if (screen.orientation && screen.orientation.type) {
        setIsLandscape(screen.orientation.type.startsWith("landscape"));
      } else {
        // fallback: сравниваем ширину и высоту окна
        setIsLandscape(window.innerWidth > window.innerHeight);
      }
    };

    checkOrientation();

    const handleResize = () => {
      // на iOS иногда нужно подождать обновления размеров
      setTimeout(checkOrientation, 100);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  if (isLandscape) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#fff",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontSize: "24px",
          padding: "1rem",
        }}
      >
        Please turn the device to portrait mode.
      </div>
    );
  }

  return <>{children}</>;
}
