"use client";
import { useEffect, useState } from "react";

export default function OrientationLock({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () =>
      setIsLandscape(window.innerWidth > window.innerHeight);
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  return (
    <>
      {isLandscape && (
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
          }}
        >
          Please turn the device to portrait mode.
        </div>
      )}
      {!isLandscape && children}
    </>
  );
}
