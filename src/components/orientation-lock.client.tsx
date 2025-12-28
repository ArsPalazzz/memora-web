"use client";

import { useEffect, useState } from "react";

export default function OrientationLock({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobileCheck = /android|iphone|ipad|ipod|mobile/i.test(ua);
    setIsMobile(mobileCheck);

    const checkOrientation = () => {
      if (!mobileCheck) return;

      if (screen.orientation && screen.orientation.type) {
        setIsLandscape(screen.orientation.type.startsWith("landscape"));
      } else {
        setIsLandscape(window.innerWidth > window.innerHeight);
      }
    };

    checkOrientation();

    const handleResize = () => setTimeout(checkOrientation, 100);

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  if (isMobile && isLandscape) {
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
