"use client";

import { useEffect, useState } from "react";

export default function OrientationLock({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const checkMobile = () => {
      if (typeof navigator === "undefined") return false;

      const userAgent = navigator.userAgent || "";
      const mobileRegex = /android|iphone|ipad|ipod|mobile/i;
      return mobileRegex.test(userAgent);
    };

    const mobile = checkMobile();
    setIsMobile(mobile);

    const checkOrientation = () => {
      if (!mobile || typeof window === "undefined") return;

      let landscape = false;

      if (screen.orientation && screen.orientation.type) {
        try {
          landscape = screen.orientation.type.startsWith("landscape");
        } catch {
          // fallback
        }
      }

      if (!landscape && window.innerWidth && window.innerHeight) {
        landscape = window.innerWidth > window.innerHeight;
      }

      setIsLandscape(landscape);
    };

    checkOrientation();

    const handleResize = () => {
      setTimeout(checkOrientation, 100);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);

      if ("onorientationchange" in window) {
        window.addEventListener("orientationchange", handleResize);
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
        if ("onorientationchange" in window) {
          window.removeEventListener("orientationchange", handleResize);
        }
      }
    };
  }, [isMounted]);

  if (!isMounted) {
    return <>{children}</>;
  }

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
